import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Timer,
  Event
} from '@mui/icons-material';
import axios from 'axios';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/admin/events');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredEvents = selectedType === 'all' 
    ? events 
    : events.filter(event => event.type === selectedType);

  const eventTypes = ['all', ...new Set(events.map(event => event.type))];

  const getEventTypeColor = (type) => {
    const colors = {
      elevate: 'error',
      tournament: 'primary',
      intra: 'success',
      annual: 'warning'
    };
    return colors[type] || 'default';
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      elevate: 'ELEVATE',
      tournament: 'Tournament',
      intra: 'Intra-College',
      annual: 'Annual Event'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Upcoming Events
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 1 }}>
        {eventTypes.map((type) => (
          <Chip
            key={type}
            label={type === 'all' ? 'All Events' : getEventTypeLabel(type)}
            onClick={() => setSelectedType(type)}
            color={type === selectedType ? 'primary' : 'default'}
            variant={type === selectedType ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} key={event._id}>
            <Paper elevation={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={getEventTypeLabel(event.type)}
                      color={getEventTypeColor(event.type)}
                      icon={<Event />}
                    />
                  </Box>

                  <Typography variant="h4" gutterBottom>
                    {event.title}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {event.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1 }} color="primary" />
                      <Typography>
                        {formatDate(event.startDate)}
                        {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1 }} color="primary" />
                      <Typography>{event.venue}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Sports & Activities:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {event.sports && event.sports.map((sport) => (
                      <Chip
                        key={sport}
                        label={sport}
                        variant="outlined"
                        sx={{ color: '#007bff', fontWeight: 500 }}
                      />
                    ))}
                  </Box>

                  {event.brochureUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        href={event.brochureUrl}
                        target="_blank"
                      >
                        Download Brochure
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}

        {filteredEvents.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="textSecondary">
              No events found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default UpcomingEvents;