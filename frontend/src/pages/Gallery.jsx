import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Modal,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/gallery');
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
        Sports Gallery
      </Typography>

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                }
              }}
              onClick={() => setSelectedImage(image)}
            >
              <CardMedia
                component="img"
                height="260"
                image={`http://localhost:4000${image.imageUrl}`}
                alt={image.title}
                sx={{ 
                  objectFit: 'cover',
                  backgroundColor: 'grey.200'
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {image.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {image.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {images.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="textSecondary">
              No images available
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 0,
            overflow: 'hidden'
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <>
              <img
                src={`http://localhost:4000${selectedImage.imageUrl}`}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 100px)',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">
                  {selectedImage.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedImage.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Gallery;