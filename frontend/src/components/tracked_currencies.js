import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Alert,
  Pagination,
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Refresh, Favorite, FavoriteBorder } from '@mui/icons-material';
import { ClipLoader } from 'react-spinners';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTheme } from './theme_context';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body2: {
      color: '#333333',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      color: '#cccccc',
    },
    body2: {
      color: '#aaaaaa',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  },
});

function TrackedCurrencies() {
  const { isDarkMode } = useTheme();
  const [topCrypto, setTopCrypto] = useState([]);
  const [trackedCurrencies, setTrackedCurrencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('No access token found. Please log in.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/tracked-currencies/?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.top_crypto) {
        setTopCrypto(response.data.top_crypto);
        setTotalPages(response.data.num_pages);
      } else {
        setError('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      setError('Failed to fetch data: ' + (error.response ? error.response.data.detail : error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTrackedCurrency = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }
      if (trackedCurrencies.includes(id)) {
        await axios.delete(`http://localhost:8000/api/tracked-currencies/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrackedCurrencies(trackedCurrencies.filter((currencyId) => currencyId !== id));
      } else {
        // Add currency tracking logic here if needed
      }
    } catch (error) {
      console.error('Error toggling tracked currency:', error);
      setError('Failed to toggle tracked currency: ' + error.message);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppBar position="static" color="primary" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Prices
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={fetchData}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Today's Cryptocurrency Prices by Market Cap
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <ClipLoader size={50} color="#1976d2" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : topCrypto.length === 0 ? (
          <Typography variant="body1">No data available</Typography>
        ) : (
          <Grid container spacing={4} sx={{ my: 4 }}>
            {topCrypto.map((crypto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={crypto.id} data-aos="fade-up">
                <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title={crypto.name}
                    subheader={`$${parseFloat(crypto.quote.USD.price).toFixed(2)}`}
                    action={
                      <IconButton
                        onClick={() => toggleTrackedCurrency(crypto.id)}
                        color={trackedCurrencies.includes(crypto.id) ? 'secondary' : 'default'}
                      >
                        {trackedCurrencies.includes(crypto.id) ? <Favorite /> : <FavoriteBorder />}
                        {console.log("ds", crypto.id)}
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2">
                      Market Cap: ${parseFloat(crypto.quote.USD.market_cap).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Box display="flex" justifyContent="center" my={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default TrackedCurrencies;
