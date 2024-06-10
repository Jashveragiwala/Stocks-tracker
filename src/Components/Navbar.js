// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '../ThemeContext';

const Navbar = () => {
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Investment Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/current-investments">Current Investments</Button>
        <Button color="inherit" component={Link} to="/past-investments">Past Investments</Button>
        <Button color="inherit" component={Link} to="/watchlist">Watchlist</Button>
        <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
          {colorMode.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
