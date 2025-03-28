import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Paper
} from '@mui/material';
import axios from 'axios';

const sports = [
  'Basketball',
  'Volleyball',
  'Table Tennis',
  'Carrom',
  'Chess',
  'Cricket',
  'Athletics'
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    sport: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' });
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number' });
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.sport) {
      setStatus({ type: 'error', message: 'Please select a sport' });
      return false;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Message is required' });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setStatus({ type: '', message: '' }); // Clear any previous error messages
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/contact', formData);
      
      if (response.status === 201) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message. We will contact you soon!'
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          sport: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'There was an error sending your message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: 4 }} id="contact">
      <Typography variant="h4" gutterBottom align="center">
        Contact Us
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        {status.message && (
          <Alert severity={status.type} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            error={status.type === 'error' && !formData.name}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            error={status.type === 'error' && !formData.phone}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={status.type === 'error' && !formData.email}
          />
          <TextField
            fullWidth
            select
            label="Sport Interest"
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            margin="normal"
            required
            error={status.type === 'error' && !formData.sport}
          >
            {sports.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
            error={status.type === 'error' && !formData.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactForm;