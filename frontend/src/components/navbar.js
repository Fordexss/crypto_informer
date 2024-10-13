import React, { useState, useEffect } from 'react';
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

const isUserLoggedIn = () => {
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('userLoggedIn='));
};

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = isUserLoggedIn();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (isUserLoggedIn()) {
        navigate('/home');
      }
    };
    window.addEventListener('load', checkAuth);
    return () => {
      window.removeEventListener('load', checkAuth);
    };
  }, [navigate]);

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
                Новини
              </MenuItem>
              <MenuItem component={Link} to="/gainers_and_losers" onClick={handleMenuClose}>
                Ріст і падіння
              </MenuItem>
              <MenuItem component={Link} to="/crypto_trending" onClick={handleMenuClose}>
                Тренди
              </MenuItem>
              {isAuthenticated ? (
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Особистий кабінет
                </MenuItem>
              ) : (
                <>
                  <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                    Увійти
                  </MenuItem>
                  <MenuItem component={Link} to="/registration" onClick={handleMenuClose}>
                    Зареєструватися
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/news" sx={{ color: 'white', mx: 1 }}>
              Новини
            </Button>
            <Button component={Link} to="/gainers_and_losers" sx={{ color: 'white', mx: 1 }}>
              Ріст і падіння
            </Button>
            <Button component={Link} to="/crypto_trending" sx={{ color: 'white', mx: 1 }}>
              Тренди
            </Button>
            {isAuthenticated ? (
              <IconButton component={Link} to="/profile" sx={{ color: 'white' }}>
                <AccountCircle />
              </IconButton>
            ) : (
              <>
                <Button component={Link} to="/login" sx={{ color: 'white', mx: 1 }}>
                  Увійти
                </Button>
                <Button component={Link} to="/registration" sx={{ color: 'white', mx: 1 }}>
                  Зареєструватися
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