import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:5000';

const AnomalyRuleCard = ({ title, endpoint }) => {
    const [anomalies, setAnomalies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAnomalies(data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [endpoint]);

    const renderTable = () => {
        if (anomalies.length === 0) {
            return <p>No anomalies detected.</p>;
        }

        const headers = Object.keys(anomalies[0]);

        return (
            <div className="table-responsive" style={{maxHeight: '300px', overflowY: 'auto'}}>
                <table className="table table-striped table-sm">
                    <thead className="thead-dark">
                        <tr>
                            {headers.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {anomalies.map((anomaly, index) => (
                            <tr key={index}>
                                {headers.map(header => <td key={header}>{anomaly[header]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">Error fetching data: {error}</div>}
                {renderTable()}
            </div>
        </div>
    );
};

function App() {
    const rules = [
        { title: 'Rule 1: Failed Logins', endpoint: '/api/rule1' },
        { title: 'Rule 2: Logins from Blacklisted Locations', endpoint: '/api/rule2' },
        { title: 'Rule 3: Multiple Failed Logins', endpoint: '/api/rule3' },
        { title: 'Rule 4: Logins Outside Business Hours', endpoint: '/api/rule4' },
        { title: 'Rule 5: Multiple Failed Logins in 5-min Window', endpoint: '/api/rule5' },
        { title: 'Rule: Failed then Successful Login', endpoint: '/api/fail_success' },
        { title: 'Rule 6: Geographically Impossible Logins', endpoint: '/api/rule6' },
    ];

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Cybersecurity Anomaly Watchdog</h1>
            {rules.map(rule => (
                <AnomalyRuleCard key={rule.title} title={rule.title} endpoint={rule.endpoint} />
            ))}
        </div>
    );
}

export default App;