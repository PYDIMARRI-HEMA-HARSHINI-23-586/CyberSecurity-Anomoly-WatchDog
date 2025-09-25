
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AnomalyTable = React.memo(({ anomalies }) => {
    if (anomalies.length === 0) {
        return <p>No anomalies detected.</p>;
    }

    const headers = Object.keys(anomalies[0]);

    return (
        <TableContainer component={Paper} sx={{maxHeight: 300}}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {headers.map(header => <TableCell key={header}>{header}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {anomalies.map((anomaly, index) => (
                        <TableRow key={index}>
                            {headers.map(header => <TableCell key={header}>{anomaly[header]}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default AnomalyTable;
