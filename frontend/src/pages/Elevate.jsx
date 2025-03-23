import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  EmojiEvents,
  SportsSoccer,
  Groups,
  School,
  DateRange,
  LocationOn
} from '@mui/icons-material';
import ElevateSchedule from '../components/ElevateSchedule';
import ElevateGallery from '../components/ElevateGallery';
import ElevateRegistration from '../components/ElevateRegistration';

const Elevate = () => {
  const sports = [
    { name: 'Basketball', participants: '16 teams' },
    { name: 'Volleyball', participants: '20 teams' },
    { name: 'Table Tennis', participants: '32 players' },
    { name: 'Chess', participants: '48 players' },
    { name: 'Carrom', participants: '32 players' }
  ];

  const highlights = [
    'Cash prizes worth ₹20,000',
    'Professional referees and officials',
    'Food stalls and entertainment'
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'white.500',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('/images/bg.jpg')`,
        minHeight: '120vh',
        width: '100%',
        py: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,.2)',
        },
      }}
    >
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          height: '70vh',
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
          marginTop: '-64px',
          paddingTop: '64px',
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(1.5) contrast(1.1)',
          }}
        >
          <source src="/videos/elevate-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>

        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,.4)',
            zIndex: 1,
          }}
        />

        {/* Buttons Container */}
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 40,
            right: 40,
            zIndex: 2,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{ 
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              }
            }}
            href="#register"
          >
            Register Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
            href="#schedule"
          >
            View Schedule
          </Button>
        </Box>
      </Paper>

      <Container maxWidth="lg">
        {/* Event Details Box */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            mb: 6 
          }}
        >
          <Grid container spacing={4}>
            {/* Left Side - About */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                About ELEVATE
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  pr: { md: 4 },
                  borderRight: { md: '1px solid rgba(0, 0, 0, 0.12)' }
                }}
              >
                ELEVATE is PICT's flagship inter-college sports championship that brings together
                the best sporting talent from colleges across Maharashtra. Now in its 8th year,
                ELEVATE has become a prestigious platform for collegiate athletes to showcase
                their skills and compete at the highest level.
              </Typography>
            </Grid>

            {/* Right Side - Event Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Event Details
                </Typography>
                <List>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <DateRange color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="h6">Date</Typography>}
                      secondary="March 15-17, 2024"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="h6">Venue</Typography>}
                      secondary="PICT Campus, Pune"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Groups color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="h6">Participation</Typography>}
                      secondary="Over 1000 athletes from 50+ colleges"
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Sports Categories Box */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            mb: 6 
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Sports Categories
          </Typography>
          <Grid container spacing={3}>
            {sports.map((sport) => (
              <Grid item xs={12} sm={6} md={4} key={sport.name}>
                <Card 
                  elevation={2}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SportsSoccer color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{sport.name}</Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        color: 'primary.main' 
                      }}
                    >
                      {sport.participants}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Schedule Section Box */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            mb: 6 
          }}
        >
          <ElevateSchedule />
        </Paper>

        {/* Event Highlights */}
        <Paper sx={{ p: 4, bgcolor: 'grey.100', mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Event Highlights
          </Typography>
          <Grid container spacing={2}>
            {highlights.map((highlight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents color="primary" sx={{ mr: 1 }} />
                  <Typography>{highlight}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Gallery Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Previous Events Gallery
          </Typography>
          <ElevateGallery />
        </Box>

        {/* Registration Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Registration
          </Typography>
          <ElevateRegistration />
        </Box>
      </Container>
    </Box>
  );
};

export default Elevate; 