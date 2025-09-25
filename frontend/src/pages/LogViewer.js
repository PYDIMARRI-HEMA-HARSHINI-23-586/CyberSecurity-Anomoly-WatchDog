
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const API_BASE_URL = 'http://localhost:5000';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/logs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLogs(data);
      } catch (e) {
        setError(e.message);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Real-time Log Viewer
      </Typography>
      {error && <Typography color="error">Error fetching logs: {error}</Typography>}
      <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: '#333', color: '#0f0', overflow: 'auto', maxHeight: '70vh' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {logs.join('')}
        </pre>
      </Paper>
    </Box>
  );
};

export default LogViewer;
