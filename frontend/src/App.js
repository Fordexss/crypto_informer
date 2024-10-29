import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/js/navbar';
import CryptoConverter from './components/js/converter';
import News from './components/js/news';
import Profile from './components/js/profile';
import Login from './components/js/login';
import Registration from './components/js/registration';
import Index from './components/js/index';
import CryptoGainersLosers from './components/js/gainers_and_losers';
import CryptoTrending from './components/js/crypto_trending';
import TrackedCurrencies from './components/js/tracked_currencies'
import { ThemeProvider } from './components/js/theme_context';
import Activation from './components/js/activation'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/converter" element={<CryptoConverter />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/gainers_and_losers" element={<CryptoGainersLosers />} />
          <Route path="/crypto_trending" element={<CryptoTrending />} />
          <Route path="/tracked_currencies" element={<TrackedCurrencies />} />
          <Route path="/activate/:token" element={<Activation />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
