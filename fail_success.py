import pathway as pw
from datetime import datetime, timedelta

# Define CSV schema
class LogSchema(pw.Schema):
    user_id: str
    location: str
    timestamp: str
    login_success: int

# Read CSV
logs = pw.io.csv.read("logs.csv", mode="streaming", schema=LogSchema)

# Convert timestamp string to naive datetime
fmt = "%Y-%m-%d %H:%M:%S"
logs = logs.with_columns(
    ts_dt=logs.timestamp.dt.strptime(fmt=fmt)
)

# Separate failed and successful logins
failed = logs.filter(logs.login_success == 0)
success = logs.filter(logs.login_success == 1)

# Perform a temporal join to find failed logins followed by success within 5 mins for the same user
suspicious = failed.join(
    success,
    failed.user_id == success.user_id
).filter(
    (success.ts_dt - failed.ts_dt > timedelta(0)) &
    (success.ts_dt - failed.ts_dt <= timedelta(minutes=5))
).select(
    failed.user_id,
    failed.location,
    failed.timestamp,
    success_timestamp=success.timestamp
)

# Write output
pw.io.csv.write(suspicious, "rule5_failed_then_success.csv")

# Run the pipeline
pw.run()