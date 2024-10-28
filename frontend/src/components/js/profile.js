import {
  Avatar, Box, Button, Divider, FormControlLabel,
  Paper, Switch, Typography, useMediaQuery,
} from '@mui/material';
import { AccountCircle, Logout, CompareArrows } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useTheme } from './theme_context';
import styled, { ThemeProvider } from 'styled-components';
import React, { useState, useEffect } from 'react';
import { CurrencyBitcoinOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => (theme === 'dark' ? '#2c2c2c' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
`;

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const cookieTheme = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dark_theme='))
      ?.split('=')[1];
    if (cookieTheme === 'true' && !isDarkMode) {
      toggleTheme();
    } else if (cookieTheme === 'false' && isDarkMode) {
      toggleTheme();
    }
  }, []);

  const handleThemeChange = (event) => {
    toggleTheme();
    const newTheme = event.target.checked ? 'true' : 'false';
    document.cookie = `dark_theme=${newTheme}; path=/;`;
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      Swal.fire('Success', 'You have successfully logged out!', 'success').then(() => {
        navigate('/home');
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Swal.fire('Error', 'An error occurred during logout.', 'error');
    }
  };

  const handleConverterClick = () => {
    navigate('/converter');
  };

  const handleTrackedCurrenciesClick = () => {
    navigate('/tracked_currencies');
  };

  return (
    <ThemeProvider theme={isDarkMode ? { mode: 'dark' } : { mode: 'light' }}>
      <ProfileContainer>
        <StyledPaper elevation={3} theme={isDarkMode ? 'dark' : 'light'}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: isDarkMode ? 'secondary.main' : 'primary.main',
                width: isSmallScreen ? 40 : 64,
                height: isSmallScreen ? 40 : 64,
                mr: 2,
              }}
            >
              <AccountCircle fontSize={isSmallScreen ? 'medium' : 'large'} />
            </Avatar>
            <Typography variant={isSmallScreen ? 'h5' : 'h4'} component="h1">
              Profile
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={handleThemeChange} />}
            label="Dark Mode"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConverterClick}
            startIcon={<CompareArrows />}
            sx={{ mt: 1, mb: 1, width: '100%' }}
          >
            Converter
          </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTrackedCurrenciesClick}
          startIcon={<CurrencyBitcoinOutlined />}
          sx={{ mt: 2, mb: 1, width: '100%' }}
        >
          Відслідковувані Валюти
        </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{ mt: 1, width: '100%' }}
          >
            Logout
          </Button>
        </StyledPaper>
      </ProfileContainer>
    </ThemeProvider>
  );
};

export default Profile;