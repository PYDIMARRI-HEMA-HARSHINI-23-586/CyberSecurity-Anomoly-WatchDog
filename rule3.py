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

# Step 1: filter failed logins
failed_logins = t.filter(pw.this.login_success == 0)

# Step 2: group by user_id and count
failed_counts = failed_logins.groupby(pw.this.user_id).reduce(
    pw.this.user_id,
    fail_count = pw.reducers.count()
)

# Step 3: keep only users with multiple failures (say >= 3)
suspicious_users = failed_counts.filter(pw.this.fail_count >= 3)

# Step 4: join back to get full failed login rows
suspicious_failed_logins = failed_logins.join(
    suspicious_users,
    pw.left.user_id == pw.right.user_id
).select(
    pw.left.user_id,
    pw.left.location,
    pw.left.timestamp,
    pw.left.login_success,
    pw.right.fail_count
)

# Step 5: write output
pw.io.csv.write(suspicious_failed_logins, "failed_rule3.csv")

pw.run()
