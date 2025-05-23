import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const { user } = useAuth(); // Ensure user is available

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/gallery`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", "Sample Title");
    formData.append("description", "Sample Description");
    formData.append("user", userId); // Ensure user ID is valid

    fetch("/api/gallery", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ensure authentication token is sent
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/gallery/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        fetchImages();
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Gallery</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}>
          Add Image
        </Button>
      </Box>

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.imageUrl} // ✅ FIXED: Use `image.imageUrl` instead of `image.url`
                alt={image.title}
                sx={{ objectFit: "cover" }}
              />
              <CardActions
                sx={{ justifyContent: "space-between", px: 2, py: 1 }}>
                <Box>
                  <Typography variant="subtitle1">{image.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(image._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Add New Image</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {formData.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {formData.file.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.file || uploading}>
              {uploading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageGallery;
