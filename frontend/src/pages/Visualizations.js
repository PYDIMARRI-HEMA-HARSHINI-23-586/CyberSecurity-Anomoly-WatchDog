
import React from 'react';
import { Box, Typography } from '@mui/material';
import Charts from '../components/Charts';

const Visualizations = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Anomaly Overview
      </Typography>
      <Charts />
    </Box>
  );
};

export default Visualizations;
