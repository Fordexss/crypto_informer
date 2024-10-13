import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const getCSRFToken = () => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
};

const isUserLoggedIn = () => {
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('userLoggedIn='));
};

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);
  const handlePassword2Toggle = () => setShowPassword2((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      Swal.fire('Ошибка', 'Пароли не совпадают', 'error');
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire('Ошибка', 'Пароль должен содержать не менее 8 символов, по крайней мере одну цифру и одну букву.', 'error');
      return;
    }

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password2', password2);

    const csrfToken = getCSRFToken();

    try {
      const response = await axios.post('http://localhost:8000/registration/', formData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      Swal.fire('Успіх', 'Реєстрація пройшла успішно!', 'success').then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire('Ошибка', error.response.data.detail || 'Проверьте введенные данные.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return false;
    }
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasNumber && hasLetter;
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h4: {
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box mt={5} p={4} boxShadow={3} borderRadius={5} bgcolor="background.paper">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePasswordToggle} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Repeat Password"
                  type={showPassword2 ? 'text' : 'password'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePassword2Toggle} edge="end">
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography align="center">
                  Вже є акаунт?{' '}
                  <Button
                    color="secondary"
                    onClick={() => navigate('/login')}
                    size="small"
                  >
                    Увійти
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Registration;