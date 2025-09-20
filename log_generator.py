# log_generator.py
import csv
import random
import time
from datetime import datetime
import os

# Users and locations
users = ["alice", "bob", "charlie", "dave"]
locations = ["Delhi", "Mumbai", "Russia", "USA"]

# Check if file exists and is empty
file_exists = os.path.exists("logs.csv") and os.path.getsize("logs.csv") > 0

# Open the CSV file in append mode
with open("logs.csv", "a", newline="") as f:
    writer = csv.writer(f)
    if not file_exists:
        writer.writerow(["user_id", "location", "timestamp", "login_success"])

    while True:
        user = random.choice(users)
        location = random.choice(locations)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        login_success = random.choice([1, 0])
        writer.writerow([user, location, timestamp, login_success])
        f.flush()  # 🔥 Make sure Pathway sees the new row immediately
        print(f"Generated log: {user}, {location}, {timestamp}, {login_success}")
        time.sleep(2)