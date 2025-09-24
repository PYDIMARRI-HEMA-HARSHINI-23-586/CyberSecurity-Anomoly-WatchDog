import pathway as pw

class LogSchema(pw.Schema):
    user_id: str
    location: str
    timestamp: str
    login_success: int

# Read logs.csv in streaming mode
t = pw.io.csv.read(
    "logs.csv",
    mode="streaming",
    schema=LogSchema
)

# Filter failed logins
failed_logins = t.filter(t.login_success == 0)

# Select columns from failed_logins (not t)
failed_logins_selected = failed_logins.select(
    failed_logins.user_id,
    failed_logins.location,
    failed_logins.timestamp
)

# Write to file
pw.io.csv.write(failed_logins_selected, "failed_logins.csv")

pw.run()
