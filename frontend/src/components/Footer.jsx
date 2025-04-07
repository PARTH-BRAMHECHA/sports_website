import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Room, Phone, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Room sx={{ mr: 1 }} />
                Survey No. 27, Near Trimurti Chowk,
                Bharati Vidyapeeth Campus,
                Dhankawadi, Pune,
                Maharashtra 411043
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1 }} />
                020 2437 1101
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1 }} />
                sports@pict.edu
              </Box>
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Sports Director
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Mr. Sachin Shinde 
              <br />
              Phone: +91 9404232781
              <br />
              Email: sports@pict.edu
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            {/* <IconButton color="inherit" component={Link} href="#" target="_blank">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" component={Link} href="#" target="_blank">
              <Twitter />
            </IconButton> */}
            <IconButton color="inherit" component={Link} href="https://www.instagram.com/pict_elevate?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank">
          <Instagram />
            </IconButton>
            {/* <IconButton color="inherit" component={Link} href="#" target="_blank">
              <LinkedIn />
            </IconButton> */}
            <Box sx={{ mt: 2 }}>
              <Link
                href="https://maps.app.goo.gl/PERWKNCHjhzUihqF6"
                target="_blank"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Room sx={{ mr: 1 }} />
                View on Google Maps
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Department of Physical Education & Sports . All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 