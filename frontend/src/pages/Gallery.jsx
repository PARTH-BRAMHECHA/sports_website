import { useState, useEffect } from "react";
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
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

// Define static images from the public folder
const staticImages = [
  {
    id: "static-1",
    title: "Sports Event Highlight",
    description: "Excitement during our annual sports tournament",
    imageUrl: "/images/IMG_5106.JPG",
  },
  {
    id: "static-2",
    title: "Team Performance",
    description: "Players showing exceptional teamwork and skill",
    imageUrl: "/images/IMG_5157.JPG",
  },
  {
    id: "static-3",
    title: "Championship Match",
    description: "Final match of the inter-college tournament",
    imageUrl: "/images/IMG_5171.JPG",
  },
  {
    id: "static-4",
    title: "Award Ceremony",
    description: "Recognizing outstanding athletic achievements",
    imageUrl: "/images/IMG_5193.JPG",
  },
  {
    id: "static-5",
    title: "Training Session",
    description: "Athletes during an intensive training program",
    imageUrl: "/images/IMG_5316.JPG",
  },
  {
    id: "static-6",
    title: "Tournament Opening",
    description: "Inaugural ceremony of our annual sports competition",
    imageUrl: "/images/IMG_5334.JPG",
  },
  {
    id: "static-7",
    title: "Player Showcase",
    description: "Student athletes displaying impressive skills",
    imageUrl: "/images/IMG_5355.JPG",
  },
  {
    id: "static-8",
    title: "Athletic Performance",
    description: "Outstanding athletic display during the competition",
    imageUrl: "/images/IMG_5361.JPG",
  },
  {
    id: "static-9",
    title: "Team Celebration",
    description: "Victory celebration after a hard-fought match",
    imageUrl: "/images/IMG_5438.JPG",
  },
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/gallery");
        setImages(data);
        // Combine backend images with static images
        setAllImages([...staticImages, ...data]);
      } catch (error) {
        console.error("Error fetching images:", error);
        // If API fails, just use static images
        setAllImages([...staticImages]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter images based on selected tab
  const displayImages =
    tabValue === 0 ? allImages : tabValue === 1 ? images : staticImages;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 3 }}>
        Sports Gallery
      </Typography>

      {/* Tabs to filter between All, Backend, and Static images */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Recent Events" />
          <Tab label="Facilities" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {displayImages.length > 0 ? (
          displayImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id || image._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => setSelectedImage(image)}>
                {" "}
                <CardMedia
                  component="img"
                  height="260"
                  image={
                    image.imageUrl && typeof image.imageUrl === "string"
                      ? image.imageUrl.startsWith("/")
                        ? image.imageUrl // Static image path
                        : `http://localhost:4000${image.imageUrl}` // Backend image path
                      : "/images/hero-bg.jpg" // Fallback image if imageUrl is undefined
                  }
                  alt={image.title || "Sports image"}
                  sx={{
                    objectFit: "cover",
                    backgroundColor: "grey.200",
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
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.secondary">
              No images available for this category
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}>
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 0,
            overflow: "hidden",
          }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}>
            <Close />
          </IconButton>
          {selectedImage && (
            <>
              <img
                src={
                  selectedImage.imageUrl.startsWith("/")
                    ? selectedImage.imageUrl // Static image path
                    : `http://localhost:4000${selectedImage.imageUrl}`
                } // Backend image path
                alt={selectedImage.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(90vh - 100px)",
                  objectFit: "contain",
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{selectedImage.title}</Typography>
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
