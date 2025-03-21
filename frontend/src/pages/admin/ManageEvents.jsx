import { useState, useEffect } from 'react';
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
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    startDate: null,
    endDate: null,
    sports: [],
    venue: '',
    description: '',
    brochureUrl: '',
    isActive: true
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/admin/events', {
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      });
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleOpen = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        type: '',
        startDate: null,
        endDate: null,
        sports: [],
        venue: '',
        description: '',
        brochureUrl: '',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure sports field is properly handled - currently empty array
      // If you have a way to select sports in your form, make sure they're included here
      const dataToSend = {
        ...formData,
        // Set a default sport if empty
        sports: formData.sports.length ? formData.sports : ['General']
      };
      
      console.log("Submitting event data:", dataToSend);
      
      if (selectedEvent) {
        await axios.put(
          `http://localhost:4000/api/admin/events/${selectedEvent._id}`,
          dataToSend,
          {
            headers: { 
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
      } else {
        await axios.post('http://localhost:4000/api/admin/events', dataToSend, {
          headers: { 
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
      fetchEvents();
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to save event: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:4000/api/admin/events/${id}`, {
          headers: { 
            'Authorization': `Bearer ${user.token}` 
          }
        });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Events</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>
                  {new Date(event.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(event.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(event._id)}>
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
          {selectedEvent ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="elevate">ELEVATE</MenuItem>
              <MenuItem value="intra">INTRA</MenuItem>
              <MenuItem value="external">External</MenuItem>
            </TextField>

            {/* Date fields */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Box>

            <TextField
              fullWidth
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <TextField
              fullWidth
              label="Brochure URL (Optional)"
              value={formData.brochureUrl}
              onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageEvents;