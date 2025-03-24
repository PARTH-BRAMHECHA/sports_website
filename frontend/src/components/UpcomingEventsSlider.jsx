import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Chip,
  Grid
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday,
  LocationOn
} from '@mui/icons-material';

// Static upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: "PICT ELEVATE 2024",
    description: "Annual Sports Festival featuring multiple sports competitions and events",
    startDate: "2024-02-24",
    endDate: "2024-02-27",
    venue: "PICT Campus Ground",
    sports: ["Basketball", "Volleyball", "Carrom", "Chess", "Table Tennis"],
    type: "elevate",
    registrationLink: "https://elevate.pict.edu"
  },
  {
    id: 2,
    title: "Inter-College Cricket Tournament",
    description: "Annual cricket championship between engineering colleges",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    venue: "PICT Cricket Ground",
    sports: ["Cricket"],
    type: "tournament"
  }
];

const UpcomingEventsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? upcomingEvents.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === upcomingEvents.length - 1 ? 0 : prevIndex + 1
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
                  label={upcomingEvents[currentIndex].type.toUpperCase()}
                  color={getEventTypeColor(upcomingEvents[currentIndex].type)}
                  size="small"
                />
                {upcomingEvents[currentIndex].registrationLink && (
                  <Chip 
                    label="Registration Open"
                    color="success"
                    size="small"
                    onClick={() => window.open(upcomingEvents[currentIndex].registrationLink)}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {upcomingEvents[currentIndex].title}
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
                {upcomingEvents[currentIndex].description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>
                  {formatDate(upcomingEvents[currentIndex].startDate)} - {formatDate(upcomingEvents[currentIndex].endDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>
                  {upcomingEvents[currentIndex].venue}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {upcomingEvents[currentIndex].sports.map((sport) => (
                  <Chip
                    key={sport}
                    label={sport}
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: 'white', // White background
                      color: '#007bff', // Blue text
                      fontWeight: 500,
                      border: '1px solid grey', // Grey border
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
