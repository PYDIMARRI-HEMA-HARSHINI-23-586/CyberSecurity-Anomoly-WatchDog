import pathway as pw
from datetime import datetime
from geopy.distance import geodesic

# Define schema for the input data.
class LogSchema(pw.Schema):
    user_id: str
    location: str
    timestamp: str
    login_success: int

# Define a dictionary to map city names to their geographical coordinates.
city_coords = {
    "Delhi": (28.7041, 77.1025),
    "Mumbai": (19.0760, 72.8777),
    "Russia": (55.7558, 37.6173),  # Moscow
    "USA": (38.9072, -77.0369),    # Washington DC
}

# Define thresholds for what is considered a suspicious login.
MIN_DISTANCE_KM = 3000
MAX_TIME_DIFF_SEC = 3600

# Read the log data from the CSV file in streaming mode.
logs = pw.io.csv.read("logs.csv", schema=LogSchema, mode="streaming")

# Parse the timestamp string into a datetime object.
logs = logs.with_columns(
    timestamp_dt=pw.this.timestamp.dt.strptime("%Y-%m-%d %H:%M:%S")
)

# Self-join the logs table to compare each login with every other login for the same user.
joined = logs.join(
    logs.copy(),
    pw.left.user_id == pw.right.user_id
)

# Filter out pairs of the same login and only consider pairs where the second login is after the first one.
# This is to avoid duplicate comparisons and comparing a login with itself.
possible_suspicious_logins = joined.filter(
    (pw.left.timestamp_dt < pw.right.timestamp_dt)
)

# Define a UDF to calculate the distance between two coordinates.
@pw.udf
def compute_distance(location1: str, location2: str) -> float:
    coords1 = city_coords.get(location1)
    coords2 = city_coords.get(location2)
    if coords1 and coords2:
        return geodesic(coords1, coords2).km
    return 0.0

@pw.udf
def timedelta_to_seconds(td) -> int:
    return int(td.total_seconds())

# Calculate the distance and time difference between the two logins.
suspicious_logins = possible_suspicious_logins.select(
    pw.left.user_id,
    location1=pw.left.location,
    timestamp1=pw.left.timestamp,
    location2=pw.right.location,
    timestamp2=pw.right.timestamp,
    distance=compute_distance(pw.left.location, pw.right.location),
    time_diff_seconds=timedelta_to_seconds(pw.right.timestamp_dt - pw.left.timestamp_dt),
)

# Filter for suspicious logins based on the distance and time difference.
suspicious_logins = suspicious_logins.filter(
    (pw.this.distance > MIN_DISTANCE_KM) & (pw.this.time_diff_seconds < MAX_TIME_DIFF_SEC)
)

# Select the columns to be written to the output file.
output = suspicious_logins.select(
    user_id=pw.this.user_id,
    location1=pw.this.location1,
    timestamp1=pw.this.timestamp1,
    location2=pw.this.location2,
    timestamp2=pw.this.timestamp2,
    distance_km=pw.this.distance,
    time_diff_seconds=pw.this.time_diff_seconds,
)

# Write the suspicious logins to a CSV file.
pw.io.csv.write(output, "failed_rule6.csv")

# Run the Pathway pipeline.
pw.run()
