import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch, Typography, Box, Button, Paper, Divider } from '@mui/material';
import { AccountCircle, Logout, CompareArrows } from '@mui/icons-material';
import Swal from 'sweetalert2';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      document.cookie = 'userLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      Swal.fire('Успіх', 'Ви успішно вийшли з аккаунту!', 'success').then(() => {
        navigate('/home');
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire('Помилка', 'Сталася помилка при виході з аккаунту.', 'error');
    }
  };

  const handleConverterClick = () => {
    navigate('/converter');
  };

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountCircle fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" gutterBottom>
            Профіль
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
          label="Dark Mode on index page"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConverterClick}
          startIcon={<CompareArrows />}
          sx={{ mt: 2, mb: 1, width: '100%' }}
        >
          Конвертер
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{ mt: 2, width: '100%' }}
        >
          Вийти
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;