import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  MobileStepper,
  Button,
  Typography,
} from "@mui/material";
import {
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

const galleryImages = [
  {
    img: "/images/IMG-20250422-WA0005.jpg",
    title: "Elevate Sports Event",
    cols: 2,
  },
  {
    img: "/images/IMG-20250422-WA0006.jpg",
    title: "Sports Competition",
    cols: 1,
  },
  {
    img: "/images/IMG-20250422-WA0007.jpg",
    title: "Tournament Match",
    cols: 1,
  },
  {
    img: "/images/IMG-20250422-WA0008.jpg",
    title: "Sports Activity",
    cols: 1,
  },
  {
    img: "/images/IMG-20250422-WA0009.jpg",
    title: "Championship Game",
    cols: 2,
  },
  {
    img: "/images/IMG-20250422-WA0010.jpg",
    title: "Sports Tournament",
    cols: 1,
  },
  {
    img: "/images/IMG_5106.JPG",
    title: "Team Event",
    cols: 1,
  },
  {
    img: "/images/IMG_5157.JPG",
    title: "Sports Competition",
    cols: 1,
  },
  {
    img: "/images/IMG_5171.JPG",
    title: "Tournament Match",
    cols: 2,
  },
  {
    img: "/images/IMG_5193.JPG",
    title: "Sports Event",
    cols: 1,
  },
  {
    img: "/images/IMG_5316.JPG",
    title: "Championship Game",
    cols: 1,
  },
  {
    img: "/images/IMG_5334.JPG",
    title: "Team Competition",
    cols: 1,
  },
];

const ElevateGallery = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxSteps = galleryImages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // For thumbnail gallery
  const thumbnailsPerPage = 6;
  const [thumbnailStart, setThumbnailStart] = useState(0);

  const handleThumbnailNext = () => {
    setThumbnailStart((prev) =>
      Math.min(
        prev + thumbnailsPerPage,
        galleryImages.length - thumbnailsPerPage
      )
    );
  };

  const handleThumbnailBack = () => {
    setThumbnailStart((prev) => Math.max(0, prev - thumbnailsPerPage));
  };

  return (
    <Box sx={{ width: "100%", mb: 6 }}>
      {/* Main Carousel */}
      <Paper
        square
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: 2,
          mb: 3,
          position: "relative",
        }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            position: "absolute",
            bottom: 50,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            py: 1,
            px: 2,
            borderRadius: 1,
            maxWidth: "80%",
          }}>
          {galleryImages[activeStep].title}
        </Typography>

        <Box
          sx={{
            height: isMobile ? 300 : 500,
            width: "100%",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}>
          <img
            src={galleryImages[activeStep].img}
            alt={galleryImages[activeStep].title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onClick={() => setSelectedImage(galleryImages[activeStep])}
          />
        </Box>

        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            "& .MuiMobileStepper-dot": {
              mx: 0.5,
            },
            "& .MuiMobileStepper-dotActive": {
              bgcolor: "primary.main",
            },
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              sx={{ mr: 1 }}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ ml: 1 }}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Paper>

      {/* Thumbnails Gallery */}
      <Box sx={{ mt: 2, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            size="small"
            onClick={handleThumbnailBack}
            disabled={thumbnailStart === 0}>
            <KeyboardArrowLeft /> Previous
          </Button>
          <Button
            size="small"
            onClick={handleThumbnailNext}
            disabled={
              thumbnailStart + thumbnailsPerPage >= galleryImages.length
            }>
            Next <KeyboardArrowRight />
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
            gap: 1,
          }}>
          {galleryImages
            .slice(thumbnailStart, thumbnailStart + thumbnailsPerPage)
            .map((item, index) => (
              <Box
                key={`${item.img}-thumb`}
                sx={{
                  height: isMobile ? 80 : 100,
                  overflow: "hidden",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    activeStep === thumbnailStart + index
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={() => setActiveStep(thumbnailStart + index)}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
        </Box>
      </Box>

      {/* Modal for expanded view */}
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
            overflow: "hidden",
          }}>
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
            onClick={() => setSelectedImage(null)}>
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage.img}
              alt={selectedImage.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ElevateGallery;
