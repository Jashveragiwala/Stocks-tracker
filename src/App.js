// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar.js';
import Dashboard from './Components/Dashboard';
import CurrentInvestments from './Pages/CurrentInvestments';
import PastInvestments from './Pages/PastInvestments';
import Watchlist from './Pages/Watchlist';
import ThemeContextProvider from './ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/current-investments" element={<CurrentInvestments />} />
          <Route path="/past-investments" element={<PastInvestments />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
