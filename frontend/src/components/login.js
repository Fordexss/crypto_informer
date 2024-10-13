import React, { useState, useEffect } from 'react';
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate('/profile');
    }
  }, [navigate]);

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isUserLoggedIn()) {
      Swal.fire('Ошибка', 'Ви вже в аккаунті. Спочатку вийдіть з нього.', 'error');
      return;
    }

    setLoading(true);

    const csrfToken = getCSRFToken();

    axios
      .post(
        'http://localhost:8000/login/',
        { email, password },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Вхід успішний:', response.data);

        const d = new Date();
        d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 3000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "userLoggedIn=true;" + expires + ";path=/";

        Swal.fire('Успіх', 'Вхід успішний!', 'success').then(() => {
          navigate('/profile');
        });
      })
      .catch((error) => {
        console.error('Помилка при вході:', error.response.data);
        Swal.fire('Помилка', error.response.data.detail || 'Перевірте введені дані.', 'error');
      })
      .finally(() => setLoading(false));
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
            Вхід
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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
                  label="Пароль"
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Вхід'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography align="center">
                  Немає акаунту?{' '}
                  <Button
                    color="secondary"
                    onClick={() => {
                      if (isUserLoggedIn()) {
                        Swal.fire('Помилка', 'Ви вже в аккаунті. Спочатку вийдіть з нього.', 'error');
                      } else {
                        navigate('/registration');
                      }
                    }}
                    size="small"
                  >
                    Зареєструватися
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

export default Login;