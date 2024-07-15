import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

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

const Watchlist = () => {
  const [data, setData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = () => {
    axios.get('http://localhost:3001/api/watchlist')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  const handleAddButtonClick = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setCompanyName('');
    setCurrentPrice('');
    setChecked(false);
  };

  const handleFormSubmit = () => {
    const parsedPrice = parseFloat(currentPrice);
    if (isNaN(parsedPrice)) {
      alert('Please enter a valid float number for the current price.');
      return;
    }

    const newStock = {
      StockName: companyName,
      CurrentPrice: parsedPrice,
      Bought: checked ? 1 : 0,
    };
    axios.post('http://localhost:3001/api/watchlist', newStock)
      .then(response => {
        console.log(response.data);
        setData([...data, response.data]);
      })
      .catch(error => {
        console.error('Error adding new stock: ', error);
      });

    handleFormClose();
  };

  const handlePriceInput = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setCurrentPrice(value);
    }
  };

  const handleDeleteStock = (row) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${row.StockName}?`);
    if (confirmed) {
      axios.delete(`http://localhost:3001/api/watchlist/${row.SerialNo}`)
        .then(response => {
          console.log(response.data);
          const updatedData = data.filter(item => item.SerialNo !== row.SerialNo);
          setData(updatedData);
        })
        .catch(error => {
          console.error('Error deleting stock: ', error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Watchlist</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddButtonClick}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        +
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Serial No.</StyledTableCell>
              <StyledTableCell>Stock's Name</StyledTableCell>
              <StyledTableCell>Current Price</StyledTableCell>
              <StyledTableCell>Bought</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell> {/* New column for Action */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const name = row.StockName || 'N/A';
              const currentPrice = row.CurrentPrice || 0;
              const serial = row.SerialNo || 0;
              const bought = row.Bought === 1 ? 'Yes' : 'No';

              return (
                <StyledTableRow key={serial} onClick={() => setSelectedStock(row)}>
                  <TableCell>{serial}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>${currentPrice.toFixed(2)}</TableCell>
                  <TableCell>{bought}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => handleDeleteStock(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>Add New Stock</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Company Name"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Current Price"
            fullWidth
            value={currentPrice}
            onInput={handlePriceInput}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                color="primary"
              />
            }
            label="Bought"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Watchlist;
