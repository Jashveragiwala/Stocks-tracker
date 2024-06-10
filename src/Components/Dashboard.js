// src/pages/Dashboard.js
import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const data = {
  netWorth: 50000,
  profitLoss: 2000,
  profitLossPercentage: 4,
};

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.dark,
  fontWeight: 'bold',
}));

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <Typography variant="h5">Net Worth</Typography>
            <Typography variant="h6">${data.netWorth}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Typography variant="h5">Current Profit/Loss</Typography>
            <Typography variant="h6">${data.profitLoss}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Typography variant="h5">Current Profit/Loss %</Typography>
            <Typography variant="h6">{data.profitLossPercentage}%</Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
