import pandas as pd

# Parameters
INPUT_FILE = "logs.csv"           # your current file name
OUTPUT_FILE = "failed_rule5.csv"
TIME_WINDOW_MINUTES = 5
FAIL_THRESHOLD = 3

# Read CSV
df = pd.read_csv(INPUT_FILE)

# Convert timestamp to datetime
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Keep only failed logins (login_success == 0)
failed_df = df[df['login_success'] == 0].copy()

# Sort by user_id and timestamp
failed_df = failed_df.sort_values(by=['user_id', 'timestamp'])

# Rolling window check: count failures within TIME_WINDOW_MINUTES
suspicious_records = []

for user, group in failed_df.groupby('user_id'):
    times = group['timestamp'].tolist()
    rows = group.to_dict('records')
    
    for i in range(len(times)):
        window_start = times[i]
        window_end = window_start + pd.Timedelta(minutes=TIME_WINDOW_MINUTES)
        
        count = sum(1 for t in times if window_start <= t <= window_end)
        
        if count >= FAIL_THRESHOLD:
            suspicious_records.append(rows[i])

# Convert back to DataFrame
suspicious_df = pd.DataFrame(suspicious_records)

suspicious_df = suspicious_df.drop_duplicates()

# Save to CSV
suspicious_df.to_csv(OUTPUT_FILE, index=False)

print(f"[+] Rule 5 detection complete. Suspicious failures saved to {OUTPUT_FILE}")
