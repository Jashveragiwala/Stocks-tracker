// src/pages/StockChart.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'WSHXU665YE6YNEW4';

const fetchStockData = async (symbol, interval, outputSize) => {
  const response = await axios.get(`https://www.alphavantage.co/query`, {
    params: {
      function: interval === 'daily' || interval === 'weekly' ? 'TIME_SERIES_' + interval.toUpperCase() : 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: interval,
      outputsize: outputSize,
      apikey: ALPHA_VANTAGE_API_KEY
    }
  });
  const timeSeries = interval === 'daily' || interval === 'weekly' ? response.data[`Time Series (${interval.toUpperCase()})`] : response.data[`Time Series (${interval})`];
  return Object.keys(timeSeries).map((key) => ({
    date: key,
    price: parseFloat(timeSeries[key]['4. close'])
  }));
};

const StockChart = ({ stock }) => {
  const [timeframe, setTimeframe] = useState('5min');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let interval = '5min';
      let outputSize = 'compact';

      switch (timeframe) {
        case '1d':
          interval = '5min';
          outputSize = 'compact';
          break;
        case '5d':
          interval = '15min';
          outputSize = 'compact';
          break;
        case '1yr':
          interval = 'daily';
          outputSize = 'full';
          break;
        case '5yr':
          interval = 'weekly';
          outputSize = 'full';
          break;
        default:
          break;
      }

      const data = await fetchStockData(stock.symbol, interval, outputSize);
      setChartData(data);
    };
    fetchData();
  }, [stock, timeframe]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>{stock.name} Stock Chart</Typography>
      <div>
        <Button variant="outlined" onClick={() => setTimeframe('1d')}>1 Day</Button>
        <Button variant="outlined" onClick={() => setTimeframe('5d')}>5 Days</Button>
        <Button variant="outlined" onClick={() => setTimeframe('1yr')}>1 Year</Button>
        <Button variant="outlined" onClick={() => setTimeframe('5yr')}>5 Years</Button>
      </div>
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </Container>
  );
}

export default StockChart;
