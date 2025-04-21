import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const levels = [
  "Khelo India",
  "All India Inter University",
  "Southwest Zone",
  "Division Level",
  "City Level",
];

const sports = [
  "Basketball",
  "Volleyball",
  "Table Tennis",
  "Carrom",
  "Chess",
  "Cricket",
  "Athletics",
];

const categories = ["Gold", "Silver", "Bronze"];
const classifications = ["Group", "Individual"];

const ManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [formData, setFormData] = useState({
    level: "",
    sportType: "",
    participantName: "",
    position: "",
    year: new Date().getFullYear(),
    category: "",
    classification: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/admin/achievements",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const handleOpen = (achievement = null) => {
    if (achievement) {
      setSelectedAchievement(achievement);
      setFormData(achievement);
    } else {
      setSelectedAchievement(null);
      setFormData({
        level: "",
        sportType: "",
        participantName: "",
        position: "",
        year: new Date().getFullYear(),
        category: "",
        classification: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAchievement(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAchievement) {
        await axios.put(
          `http://localhost:4000/api/admin/achievements/${selectedAchievement._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else {
        await axios.post(
          "http://localhost:4000/api/admin/achievements",
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      }
      fetchAchievements();
      handleClose();
    } catch (error) {
      console.error("Error saving achievement:", error);
    }
  };

  const handleDeleteConfirmation = (achievement) => {
    setAchievementToDelete(achievement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAchievementToDelete(null);
  };

  const handleDeleteAchievement = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admin/achievements/${achievementToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      fetchAchievements();
      setDeleteDialogOpen(false);
      setAchievementToDelete(null);
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Achievements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}>
          Add Achievement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Participant Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Classification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {achievements.map((achievement) => (
              <TableRow key={achievement._id}>
                <TableCell>{achievement.level}</TableCell>
                <TableCell>{achievement.sportType}</TableCell>
                <TableCell>{achievement.participantName}</TableCell>
                <TableCell>{achievement.position}</TableCell>
                <TableCell>{achievement.year}</TableCell>
                <TableCell>{achievement.category}</TableCell>
                <TableCell>{achievement.classification}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(achievement)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteConfirmation(achievement)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAchievement ? "Edit Achievement" : "Add New Achievement"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Level"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              margin="normal"
              required>
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Sport"
              value={formData.sportType}
              onChange={(e) =>
                setFormData({ ...formData, sportType: e.target.value })
              }
              margin="normal"
              required>
              {sports.map((sport) => (
                <MenuItem key={sport} value={sport}>
                  {sport}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Participant Name"
              value={formData.participantName}
              onChange={(e) =>
                setFormData({ ...formData, participantName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              margin="normal"
              required
              InputProps={{ inputProps: { min: 2000, max: 2100 } }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              margin="normal"
              required>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Classification"
              value={formData.classification}
              onChange={(e) =>
                setFormData({ ...formData, classification: e.target.value })
              }
              margin="normal"
              required>
              {classifications.map((classification) => (
                <MenuItem key={classification} value={classification}>
                  {classification}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedAchievement ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete Achievement</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this achievement?
            {achievementToDelete && (
              <Box sx={{ mt: 2, fontWeight: "bold" }}>
                "{achievementToDelete.sportType} -{" "}
                {achievementToDelete.position}"
                {achievementToDelete.classification === "Individual" &&
                  ` by ${achievementToDelete.participantName}`}
              </Box>
            )}
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteAchievement}
            color="error"
            variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageAchievements;
