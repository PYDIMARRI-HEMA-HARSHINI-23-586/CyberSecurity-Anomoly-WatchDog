# CyberSecurity-Anomoly-WatchDog

This project uses the Pathway framework to detect anomalies in real-time from a stream of log data.

## Features

- Real-time anomaly detection using Pathway.
- Rule-based detection of various security threats.
- Generation of CSV reports for each detected anomaly.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/CyberSecurity-Anomoly-WatchDog.git
    cd CyberSecurity-Anomoly-WatchDog
    ```

2.  **Create a virtual environment and install dependencies:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

## Usage

You need to run two scripts in separate terminals.

1.  **Terminal 1: Run the log generator:**

    This script will generate simulated log data and write it to `logs.csv`.

    ```bash
    python log_generator.py
    ```

2.  **Terminal 2: Run the anomaly detection rules:**

    You can run any of the rule scripts to detect specific anomalies. Each script will generate a CSV file with the detected anomalies.

    For example, to run `rule1.py`:
    ```bash
    python rule1.py
    ```

## How it works

-   `log_generator.py`: This script generates random log entries with a `user_id`, `location`, `timestamp`, and `login_success` status. It writes these logs to a `logs.csv` file.

-   **Anomaly Detection Rules:**
    -   `rule1.py`: Detects all failed login attempts. Output: `failed_logins.csv`
    -   `rule2.py`: Detects logins from blacklisted locations (Russia, USA). Output: `failed_rule2.csv`
    -   `rule3.py`: Detects users with multiple failed login attempts (>= 3). Output: `failed_rule3.csv`
    -   `rule4.py`: Detects successful logins outside of normal business hours (9 AM to 6 PM). Output: `rule4_outside_hours.csv`
    -   `rule5.py`: Detects multiple failed login attempts for the same user within a 5-minute window. Output: `failed_rule5.csv`
    -   `fail_success.py`: Detects when a user has a failed login attempt and then a successful one within 5 minutes. Output: `rule5_failed_then_success.csv`
    -   `rule6.py`: Detects geographically impossible logins (logins from two distant countries within an unrealistic time window). Output: `failed_rule6.csv`