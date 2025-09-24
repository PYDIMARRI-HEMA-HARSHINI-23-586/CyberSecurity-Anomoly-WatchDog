import pathway as pw
from datetime import datetime

# Define CSV schema
class LogSchema(pw.Schema):
    user_id: str
    location: str
    timestamp: str
    login_success: int

# Read CSV
t = pw.io.csv.read("logs.csv", mode="streaming", schema=LogSchema)

# 1️⃣ Convert timestamp string to hour
@pw.udf
def get_hour(ts: str) -> int:
    return datetime.strptime(ts, "%Y-%m-%d %H:%M:%S").hour

hour_column = get_hour(t.timestamp)

# 2️⃣ Flag logins outside 9AM–6PM
@pw.udf
def is_outside_hours(hour: int) -> bool:
    return hour < 9 or hour >= 18

outside_flag = is_outside_hours(hour_column)

# 3️⃣ Filter for successful logins outside normal hours
suspicious_logins = t.filter((t.login_success == 1) & outside_flag)

# 4️⃣ Select columns to save
suspicious_logins_selected = suspicious_logins.select(
    suspicious_logins.user_id,
    suspicious_logins.location,
    suspicious_logins.timestamp
)

# 5️⃣ Write to CSV
pw.io.csv.write(suspicious_logins_selected, "rule4_outside_hours.csv")

# 6️⃣ Run the Pathway pipeline
pw.run()
