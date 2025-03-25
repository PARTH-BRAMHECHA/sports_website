import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday,
  LocationOn
} from '@mui/icons-material';
import axios from 'axios';

const UpcomingEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/admin/events');
      // Filter for upcoming events
      const upcomingEvents = data.filter(event => new Date(event.startDate) > new Date());
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      elevate: 'error',
      tournament: 'primary',
      intra: 'success'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Typography variant="h6" color="textSecondary">
          No upcoming events
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', my: 4 }}>
      <Card 
        sx={{ 
          minHeight: 300,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={events[currentIndex].type.toUpperCase()}
                  color={getEventTypeColor(events[currentIndex].type)}
                  size="small"
                />
                {events[currentIndex].brochureUrl && (
                  <Chip 
                    label="Brochure Available"
                    color="success"
                    size="small"
                    onClick={() => window.open(events[currentIndex].brochureUrl)}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {events[currentIndex].title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  textAlign: 'left',
                  maxWidth: '800px',
                  pl: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                {events[currentIndex].description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>
                  {formatDate(events[currentIndex].startDate)} - {formatDate(events[currentIndex].endDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>
                  {events[currentIndex].venue}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {events[currentIndex].sports && events[currentIndex].sports.map((sport) => (
                  <Chip
                    key={sport}
                    label={sport}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      color: '#007bff',
                      fontWeight: 500,
                      border: '1px solid grey',
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.200' }
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.200' }
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default UpcomingEventsSlider;