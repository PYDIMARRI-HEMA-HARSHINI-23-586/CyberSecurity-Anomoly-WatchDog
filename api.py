import os
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid

app = Flask(__name__)
CORS(app)

RULES_FILE = 'custom_rules.json'
NOTIFICATIONS_FILE = 'notification_configs.json'

def read_csv_safe(file_path):
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        return pd.read_csv(file_path)
    return pd.DataFrame()

def read_rules():
    if os.path.exists(RULES_FILE):
        with open(RULES_FILE, 'r') as f:
            return json.load(f)
    return []

def write_rules(rules):
    with open(RULES_FILE, 'w') as f:
        json.dump(rules, f, indent=4)

def read_notifications():
    if os.path.exists(NOTIFICATIONS_FILE):
        with open(NOTIFICATIONS_FILE, 'r') as f:
            return json.load(f)
    return []

def write_notifications(notifications):
    with open(NOTIFICATIONS_FILE, 'w') as f:
        json.dump(notifications, f, indent=4)

@app.route('/api/rule1')
def get_rule1_data():
    df = read_csv_safe('failed_logins.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule1_with_llm')
def get_rule1_with_llm_data():
    df = read_csv_safe('failed_logins_with_explanations.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule2')
def get_rule2_data():
    df = read_csv_safe('failed_rule2.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule3')
def get_rule3_data():
    df = read_csv_safe('failed_rule3.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule4')
def get_rule4_data():
    df = read_csv_safe('rule4_outside_hours.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule5')
def get_rule5_data():
    df = read_csv_safe('failed_rule5.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/fail_success')
def get_fail_success_data():
    df = read_csv_safe('rule5_failed_then_success.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/rule6')
def get_rule6_data():
    df = read_csv_safe('failed_rule6.csv')
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/logs')
def get_logs():
    try:
        with open('logs.csv', 'r') as f:
            logs = f.readlines()
        return jsonify(logs)
    except FileNotFoundError:
        return jsonify([])

@app.route('/api/rules', methods=['GET', 'POST'])
def handle_rules():
    if request.method == 'GET':
        rules = read_rules()
        return jsonify(rules)
    elif request.method == 'POST':
        new_rule = request.json
        new_rule['id'] = str(uuid.uuid4())
        rules = read_rules()
        rules.append(new_rule)
        write_rules(rules)
        return jsonify(new_rule), 201

@app.route('/api/rules/<rule_id>', methods=['PUT', 'DELETE'])
def handle_single_rule(rule_id):
    rules = read_rules()
    rule_index = next((i for i, rule in enumerate(rules) if rule['id'] == rule_id), None)

    if rule_index is None:
        return jsonify({'message': 'Rule not found'}), 404

    if request.method == 'PUT':
        updated_rule = request.json
        rules[rule_index] = {**rules[rule_index], **updated_rule}
        write_rules(rules)
        return jsonify(rules[rule_index])
    elif request.method == 'DELETE':
        del rules[rule_index]
        write_rules(rules)
        return jsonify({'message': 'Rule deleted'}), 204

@app.route('/api/notifications', methods=['GET', 'POST'])
def handle_notifications():
    if request.method == 'GET':
        notifications = read_notifications()
        return jsonify(notifications)
    elif request.method == 'POST':
        new_notification = request.json
        new_notification['id'] = str(uuid.uuid4())
        notifications = read_notifications()
        notifications.append(new_notification)
        write_notifications(notifications)
        return jsonify(new_notification), 201

@app.route('/api/notifications/<notification_id>', methods=['PUT', 'DELETE'])
def handle_single_notification(notification_id):
    notifications = read_notifications()
    notification_index = next((i for i, notification in enumerate(notifications) if notification['id'] == notification_id), None)

    if notification_index is None:
        return jsonify({'message': 'Notification not found'}), 404

    if request.method == 'PUT':
        updated_notification = request.json
        notifications[notification_index] = {**notifications[notification_index], **updated_notification}
        write_notifications(notifications)
        return jsonify(notifications[notification_index])
    elif request.method == 'DELETE':
        del notifications[notification_index]
        write_notifications(notifications)
        return jsonify({'message': 'Notification deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)
