import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import CryptoConverter from './components/converter';
import News from './components/news';
import Profile from './components/profile';
import { ThemeProvider } from './components/profile';
import Login from './components/login';
import Registration from './components/registration';
import Index from './components/index';
import CryptoGainersLosers from './components/gainers_and_losers';
import CryptoTrending from './components/crypto_trending';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/converter/" element={<CryptoConverter />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/gainers_and_losers" element={<CryptoGainersLosers />} />
          <Route path="/crypto_trending" element={<CryptoTrending />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;