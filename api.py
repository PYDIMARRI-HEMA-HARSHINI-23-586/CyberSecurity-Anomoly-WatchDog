import os
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def read_csv_safe(file_path):
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        return pd.read_csv(file_path)
    return pd.DataFrame()

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

if __name__ == '__main__':
    app.run(debug=True)
