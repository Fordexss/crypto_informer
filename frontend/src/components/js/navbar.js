import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NewsIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const isUserLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = isUserLoggedIn();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)' }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            fontWeight: 'bold',
          }}
        >
          CryptoInformer
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/news" onClick={handleMenuClose}>
                <NewsIcon sx={{ mr: 1 }} /> News
              </MenuItem>
              <MenuItem component={Link} to="/gainers_and_losers" onClick={handleMenuClose}>
                <ArrowUpwardIcon sx={{ mr: 1 }} /> Gainers and losers
              </MenuItem>
              <MenuItem component={Link} to="/crypto_trending" onClick={handleMenuClose}>
                <TrendingUpIcon sx={{ mr: 1 }} /> Trends
              </MenuItem>
              {isAuthenticated ? (
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
              ) : (
                <>
                  <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                    <AccountCircle sx={{ mr: 1 }} /> Log in
                  </MenuItem>
                  <MenuItem component={Link} to="/registration" onClick={handleMenuClose}>
                    <AccountCircle sx={{ mr: 1 }} /> Registration
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/news" sx={{ color: 'white', mx: 1 }}>
              <NewsIcon sx={{ mr: 0.5 }} /> News
            </Button>
            <Button component={Link} to="/gainers_and_losers" sx={{ color: 'white', mx: 1 }}>
              <ArrowUpwardIcon sx={{ mr: 0.5 }} /> Gainers and losers
            </Button>
            <Button component={Link} to="/crypto_trending" sx={{ color: 'white', mx: 1 }}>
              <TrendingUpIcon sx={{ mr: 0.5 }} /> Trends
            </Button>
            {isAuthenticated ? (
              <IconButton component={Link} to="/profile" sx={{ color: 'white' }}>
                <AccountCircle />
              </IconButton>
            ) : (
              <>
                <Button component={Link} to="/login" sx={{ color: 'white', mx: 1 }}>
                  <AccountCircle sx={{ mr: 0.5 }} /> Log in
                </Button>
                <Button component={Link} to="/registration" sx={{ color: 'white', mx: 1 }}>
                  <AccountCircle sx={{ mr: 0.5 }} /> Registration
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
