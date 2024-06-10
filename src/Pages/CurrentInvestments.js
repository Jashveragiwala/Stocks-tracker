// src/pages/CurrentInvestments.js
import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const data = [
  { id: 1, name: 'Stock A', buyingPrice: 100, currentPrice: 120, quantity: 50 },
  { id: 2, name: 'Stock B', buyingPrice: 200, currentPrice: 180, quantity: 30 },
];

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
  // Hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CurrentInvestments = () => {
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
              const commission = calculateCommission(row.buyingPrice);
              const profitPerShare = calculateProfitPerShare(row.buyingPrice, row.currentPrice);
              const overallProfit = calculateOverallProfit(profitPerShare, row.quantity);
              const totalInvested = calculateTotalInvested(row.buyingPrice, row.quantity);

              return (
                <StyledTableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>${row.buyingPrice.toFixed(2)}</TableCell>
                  <TableCell>${row.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
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
