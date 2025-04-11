import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const sports = [
  'Basketball',
  'Volleyball',
  'Cricket',
  'Table Tennis',
  'Chess',
  'Carrom'
];

const ElevateRegistration = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    teamName: '',
    sport: '',
    captainName: '',
    email: '',
    phone: '',
    teamSize: '',
    alternateContact: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        setFetchingSettings(true);
        const response = await axios.get('http://localhost:4000/api/settings/registration-status');
        setRegistrationEnabled(response.data.registrationEnabled);
      } catch (error) {
        console.error('Error fetching registration status:', error);
        // Default to enabled if there's an error fetching the status
        setRegistrationEnabled(true);
      } finally {
        setFetchingSettings(false);
      }
    };
    
    fetchRegistrationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // College Name validation
    if (formData.collegeName.length < 3) {
      newErrors.collegeName = 'College name must be at least 3 characters long';
    }

    // Team Name validation
    if (formData.teamName.length < 2) {
      newErrors.teamName = 'Team name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Team Size validation
    const teamSize = parseInt(formData.teamSize);
    if (isNaN(teamSize) || teamSize < 1) {
      newErrors.teamSize = 'Team size must be at least 1';
    }

    // Alternate Contact validation (optional)
    if (formData.alternateContact && !phoneRegex.test(formData.alternateContact)) {
      newErrors.alternateContact = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!registrationEnabled) {
      setSnackbar({
        open: true,
        message: 'Registration is currently closed. Please check back later.',
        severity: 'error'
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // The correct endpoint path based on the backend route configuration
      await axios.post('http://localhost:4000/api/elevate/register', formData);
      setSnackbar({
        open: true,
        message: 'Registration successful! We will contact you soon.',
        severity: 'success'
      });
      setFormData({
        collegeName: '',
        teamName: '',
        sport: '',
        captainName: '',
        email: '',
        phone: '',
        teamSize: '',
        alternateContact: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box id="register">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom align="center">
          Team Registration
        </Typography>
        
        {fetchingSettings ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : !registrationEnabled ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body1" align="center">
              Registration is currently closed. Please check back later or contact us for more information.
            </Typography>
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Register your team for ELEVATE 2024 before February 28, 2024
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
                error={!!errors.collegeName}
                helperText={errors.collegeName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
                error={!!errors.teamName}
                helperText={errors.teamName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                required
              >
                {sports.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Team Size"
                name="teamSize"
                type="number"
                value={formData.teamSize}
                onChange={handleChange}
                required
                error={!!errors.teamSize}
                helperText={errors.teamSize}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Captain Name"
                name="captainName"
                value={formData.captainName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Contact"
                name="alternateContact"
                value={formData.alternateContact}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Registration'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ElevateRegistration;