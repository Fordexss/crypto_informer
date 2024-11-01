import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Box,
  Paper
} from '@mui/material';

const Activation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activationAttempted, setActivationAttempted] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (activationAttempted) return;

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/auth/activate/${token}/`);
        console.log('Activation response:', response.data);
        setSuccess(true);
        setActivationAttempted(true);
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been successfully activated!',
          icon: 'success',
          confirmButtonText: 'Log in'
        }).then(() => {
          navigate('/login', { replace: true });
        });
      } catch (error) {
        console.error('Activation error:', error);
        setError(error.response?.data?.error || 'Account activation error');
        setActivationAttempted(true);
        if (error.response?.status === 400) {
          navigate('/login', { replace: true });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Invalid link or account is already activated',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && !activationAttempted) {
      activateAccount();
    } else if (!token) {
      setError('Token not found');
      setLoading(false);
    }
  }, [token, navigate, activationAttempted]);

  useEffect(() => {
    if (success) {
      navigate('/login', { replace: true });
    }
  }, [success, navigate]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6">
            Account activation...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center'
          }}
        >
          {error && !success ? (
            <>
              <Typography
                variant="h5"
                color="error"
                gutterBottom
              >
                Activation error
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
              >
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/registration', { replace: true })}
                sx={{ mt: 2 }}
              >
                Return to registration
              </Button>
            </>
          ) : success ? (
            <>
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
              >
                Account has been successfully activated
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
              >
                You can now log in to your account
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login', { replace: true })}
                sx={{ mt: 2 }}
              >
                Go to the log in
              </Button>
            </>
          ) : null}
        </Paper>
      </Box>
    </Container>
  );
};

export default Activation;