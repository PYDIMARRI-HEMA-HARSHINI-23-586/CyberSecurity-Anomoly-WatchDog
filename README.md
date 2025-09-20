# CyberSecurity-Anomoly-WatchDog

This project uses Pathway and the Gemini API to detect anomalies in real-time from a stream of log data.

## Features

- Real-time anomaly detection using Pathway.
- Explanation of security alerts using the Gemini API.
- Blacklisting of suspicious locations.
- Detection of failed login attempts.

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
    
    **Note:** If you don't have a `requirements.txt` file, you can create one with the following content:
    
    ```
    pathway
    google-generativeai
    ```
    
    Then run `pip install -r requirements.txt`.

3.  **Set your Gemini API key:**

    You need to have a Gemini API key to run the `anomaly_detector.py` script. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    Set the API key as an environment variable:

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

## Usage

You need to run two scripts in separate terminals.

1.  **Terminal 1: Run the log generator:**

    This script will generate simulated log data and write it to `logs.csv`.

    ```bash
    python log_generator.py
    ```

2.  **Terminal 2: Run the anomaly detector:**

    This script will monitor the `logs.csv` file for new entries, detect anomalies, and print alerts to the console.

    ```bash
    python anomaly_detector.py
    ```

## How it works

-   `log_generator.py`: This script generates random log entries with a `user_id`, `location`, `timestamp`, and `login_success` status. It writes these logs to a `logs.csv` file.
-   `anomaly_detector.py`: This script uses Pathway to read the `logs.csv` file in a streaming mode. For each new log entry, it checks for the following anomalies:
    -   The login location is in the `BLACKLISTED_LOCATIONS` list (currently "Russia" and "USA").
    -   The `login_success` status is '0' (failed login).
-   When an anomaly is detected, the script uses the Gemini API to generate an explanation of why the alert is a security concern.
-   The alert and the explanation are then printed to the console.
