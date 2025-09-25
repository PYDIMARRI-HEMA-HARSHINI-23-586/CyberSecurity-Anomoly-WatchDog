import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:5000';

const rules = [
    { name: 'Rule 1', endpoint: '/api/rule1' },
    { name: 'Rule 2', endpoint: '/api/rule2' },
    { name: 'Rule 3', endpoint: '/api/rule3' },
    { name: 'Rule 4', endpoint: '/api/rule4' },
    { name: 'Rule 5', endpoint: '/api/rule5' },
    { name: 'Fail Success', endpoint: '/api/fail_success' },
    { name: 'Rule 6', endpoint: '/api/rule6' },
];

const Charts = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const chartData = await Promise.all(
                rules.map(async (rule) => {
                    try {
                        const response = await fetch(`${API_BASE_URL}${rule.endpoint}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const anomalies = await response.json();
                        return { name: rule.name, count: anomalies.length };
                    } catch (e) {
                        console.error(`Error fetching data for ${rule.name}:`, e);
                        return { name: rule.name, count: 0 };
                    }
                })
            );
            setData(chartData);
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Charts;