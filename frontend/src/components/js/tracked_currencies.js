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
  CardFooter,
  Grid,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Refresh, Favorite } from '@mui/icons-material';
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
});

function Index() {
  const { isDarkMode } = useTheme();
  const [topCrypto, setTopCrypto] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(35);

  const fetchData = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(`http://localhost:8000/api/tracked-currencies/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.top_crypto) {
        if (response.data.top_crypto.length === 0 && page !== 1) {
          setCurrentPage(1);
          fetchData(1);
          return;
        }
        setTopCrypto(response.data.top_crypto);
        setTotalPages(response.data.num_pages);
      } else {
        setError('Unexpected data format');
      }
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrackClick = async (cryptoId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError('No access token found. Please log in.');
      return;
    };

    try {
      await axios.delete(`http://localhost:8000/api/tracked-currencies/${cryptoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get(`http://localhost:8000/api/tracked-currencies/?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.top_crypto.length === 0 && currentPage !== 1) {
        setCurrentPage(1);
        fetchData(1);
      } else {
        fetchData(currentPage);
      }
    } catch (error) {
      setCurrentPage(1)
      fetchData(1)
      setError('No cryptocurrencies on this page');
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData(currentPage);

    const intervalId = setInterval(() => {
      fetchData(currentPage);
      setSecondsLeft(35);
    }, 35000);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => (prev === 1 ? 35 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownInterval);
    };
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
            <IconButton color="inherit" onClick={() => fetchData(currentPage)}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={((35 - secondsLeft) / 35) * 100}
            size={60}
            thickness={5}
            color="secondary"
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div" color="textSecondary">
              {secondsLeft}s
            </Typography>
          </Box>
        </Box>
      </Box>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Today's Cryptocurrency Prices by Market Cap
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Top 100 Cryptocurrencies:
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <ClipLoader size={50} color="#1976d2" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : topCrypto.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            You haven't added any cryptocurrencies
          </Alert>
        ) : (
          <>
            <Grid container spacing={4} sx={{ my: 4 }}>
              {topCrypto.map((crypto, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={crypto.id} data-aos="fade-up">
                  <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <CardHeader
                      title={`${(currentPage - 1) * 20 + index + 1}. ${crypto.name}`}
                      subheader={`$${parseFloat(crypto.quote.USD.price).toFixed(2)}`}
                      action={
                        <IconButton onClick={() => handleDeleteTrackClick(crypto.id)}>
                          <Favorite />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: crypto.quote.USD.percent_change_1h < 0 ? 'red' : 'green' }}
                      >
                        {crypto.quote.USD.percent_change_1h < 0 ? <ArrowDownward /> : <ArrowUpward />}
                        {parseFloat(crypto.quote.USD.percent_change_1h).toFixed(2)}% (1h)
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: crypto.quote.USD.percent_change_24h < 0 ? 'red' : 'green' }}
                      >
                        {crypto.quote.USD.percent_change_24h < 0 ? <ArrowDownward /> : <ArrowUpward />}
                        {parseFloat(crypto.quote.USD.percent_change_24h).toFixed(2)}% (24h)
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: crypto.quote.USD.percent_change_7d < 0 ? 'red' : 'green' }}
                      >
                        {crypto.quote.USD.percent_change_7d < 0 ? <ArrowDownward /> : <ArrowUpward />}
                        {parseFloat(crypto.quote.USD.percent_change_7d).toFixed(2)}% (7d)
                      </Typography>
                       <Typography variant="body2">
                        Market Cap: ${parseFloat(crypto.quote.USD.market_cap).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
              sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
              />
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Index;