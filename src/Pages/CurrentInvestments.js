import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const calculateCommission = (price) => price * 0.0066 * 2;
const calculateProfitPerShare = (buyingPrice, currentPrice) => currentPrice - buyingPrice - calculateCommission(buyingPrice);
const calculateOverallProfit = (profitPerShare, quantity) => profitPerShare * quantity;
const calculateTotalInvested = (buyingPrice, quantity) => buyingPrice * quantity + calculateCommission(buyingPrice) * quantity;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CurrentInvestments = () => {
  const [data, setData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/watchlist')
      .then(response => {
        console.log(response.data); // Log the data to inspect the structure
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Current Investments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Serial No.</StyledTableCell>
              <StyledTableCell>Stock's Name</StyledTableCell>
              <StyledTableCell>Buying Price</StyledTableCell>
              <StyledTableCell>Current Price</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Commission</StyledTableCell>
              <StyledTableCell>Profit per Share</StyledTableCell>
              <StyledTableCell>Overall Profit</StyledTableCell>
              <StyledTableCell>Total Invested</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              console.log(row); // Log the row to inspect the structure
              const name = row.StockName || 'N/A';
              const buyingPrice = row.Bought || 0;
              const currentPrice = row.CurrentPrice || 0;
              const quantity = row.SerialNo || 0;

              const commission = calculateCommission(buyingPrice);
              const profitPerShare = calculateProfitPerShare(buyingPrice, currentPrice);
              const overallProfit = calculateOverallProfit(profitPerShare, quantity);
              const totalInvested = calculateTotalInvested(buyingPrice, quantity);

              return (
                <StyledTableRow key={row.SerialNo} onClick={() => setSelectedStock(row)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>${buyingPrice.toFixed(2)}</TableCell>
                  <TableCell>${currentPrice.toFixed(2)}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>${commission.toFixed(2)}</TableCell>
                  <TableCell>${profitPerShare.toFixed(2)}</TableCell>
                  <TableCell>${overallProfit.toFixed(2)}</TableCell>
                  <TableCell>${totalInvested.toFixed(2)}</TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default CurrentInvestments;
