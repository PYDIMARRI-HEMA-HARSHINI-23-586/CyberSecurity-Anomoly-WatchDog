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

# Define blacklist (all lowercase for consistency)
blacklist = {"Russia", "USA"}

# Build filter expression using pw.this
blacklisted_logins = t.filter(
    (pw.this.location == "Russia") | (pw.this.location == "USA")
)

# Select relevant columns
blacklisted_selected = blacklisted_logins.select(
    pw.this.user_id,
    pw.this.location,
    pw.this.timestamp,
    pw.this.login_success
)

# Write to file
pw.io.csv.write(blacklisted_selected, "failed_rule2.csv")

pw.run()
