# anomaly_detector.py
import pathway as pw
import google.generativeai as genai
import os
import sys

# 1️⃣ Gemini API key check
gemini_api_key = os.environ.get("GEMINI_API_KEY")
if not gemini_api_key:
    print("❌ GEMINI_API_KEY is not set")
    sys.exit(1)

genai.configure(api_key=gemini_api_key)

# 2️⃣ Config
BLACKLISTED_LOCATIONS = ["Russia", "USA"]
already_alerted = set()

# 3️⃣ Explain alert function
def explain_alert(alert_text: str) -> str:
    """Call Gemini API to explain why this alert is a security concern."""
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(
        f"Explain why this is a security concern: {alert_text}"
    )
    return response.text.strip()

# 4️⃣ UDF for anomaly detection
@pw.udf
def detect_anomaly(user_id: str, location: str, timestamp: str, login_success: str) -> str:
    key = f"{user_id}_{location}_{timestamp}_{login_success}"
    if key in already_alerted:
        return None

    alert = None
    if location in BLACKLISTED_LOCATIONS:
        alert = f"ALERT 🚨 {user_id} logged in from suspicious location: {location} at {timestamp}"
    elif login_success == '0':
        alert = f"ALERT 🚨 {user_id} failed login at {timestamp}"

    if alert:
        explanation = explain_alert(alert)
        already_alerted.add(key)
        return f"{alert}\nExplanation: {explanation}"

    return None

# 5️⃣ Load CSV schema & make table live
class LogSchema(pw.Schema):
    user_id: str
    location: str
    timestamp: str
    login_success: str

logs = pw.io.csv.read("logs.csv", schema=LogSchema, mode="streaming")

# 6️⃣ Apply anomaly detection & filter for non-None alerts
alerts = logs.with_columns(
    alert=detect_anomaly(
        logs.user_id, logs.location, logs.timestamp, logs.login_success
    )
).filter(
    pw.this.alert != None
)

# 7️⃣ Print alerts to console
def on_change(key, row, time, is_addition):
    if is_addition:
        print(row['alert'])

pw.io.subscribe(alerts, on_change)

# 8️⃣ Run Pathway pipeline
pw.run()
