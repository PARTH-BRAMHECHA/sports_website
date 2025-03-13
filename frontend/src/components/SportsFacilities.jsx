import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import facilitiesData from '../data/facilitiesData';

const SportsFacilities = () => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Sports Facilities
      </Typography>
      <Grid container spacing={4}>
        {facilitiesData.map((facility) => (
          <Grid item key={facility.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={facility.image}
                alt={facility.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {facility.name}
                </Typography>
                <Typography>
                  {facility.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SportsFacilities; 