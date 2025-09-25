
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AnomalyTable from './AnomalyTable';

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
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [endpoint]);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                {error && <Typography color="error">Error fetching data: {error}</Typography>}
                <AnomalyTable anomalies={anomalies} />
            </CardContent>
        </Card>
    );
};

export default AnomalyRuleCard;
