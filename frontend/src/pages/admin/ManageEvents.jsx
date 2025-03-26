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
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sportInput, setSportInput] = useState('');
  const [error, setError] = useState('');
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
      setError('Failed to load events. Please try again.');
    }
  };

  const handleOpen = (event = null) => {
    setError('');
    if (event) {
      setSelectedEvent(event);
      setFormData({
        ...event,
        startDate: dayjs(event.startDate),
        endDate: dayjs(event.endDate),
        // Ensure sports is always an array
        sports: Array.isArray(event.sports) ? event.sports : 
               (typeof event.sports === 'string' ? event.sports.split(',') : [])
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
    setSportInput('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setError('');
  };

  const handleAddSport = () => {
    if (sportInput.trim() !== '') {
      setFormData({
        ...formData,
        sports: [...formData.sports, sportInput.trim()]
      });
      setSportInput('');
    }
  };

  const handleRemoveSport = (sportToRemove) => {
    setFormData({
      ...formData,
      sports: formData.sports.filter(sport => sport !== sportToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert dayjs objects to ISO strings for API submission
      const dataToSend = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        // Ensure sports is always an array with at least one item
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
      setError(error.response?.data?.error || error.message);
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
            {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}
            
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              select
              label="Type"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="elevate">ELEVATE</MenuItem>
              <MenuItem value="intra">INTRA</MenuItem>
              <MenuItem value="tournament">Tournament</MenuItem>
              <MenuItem value="annual">Annual Event</MenuItem>
              <MenuItem value="external">External</MenuItem>
            </TextField>

            {/* Date fields */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate ? formData.startDate.format('YYYY-MM-DD') : ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  startDate: e.target.value ? dayjs(e.target.value) : null
                })}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate ? formData.endDate.format('YYYY-MM-DD') : ''}
                onChange={(e) => setFormData({
                  ...formData,
                  endDate: e.target.value ? dayjs(e.target.value) : null
                })}
              />
            </Box>

            <TextField
              fullWidth
              label="Venue"
              value={formData.venue || ''}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              margin="normal"
              required
            />

            {/* Sports field - now handling properly as an array */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Sport"
                  value={sportInput}
                  onChange={(e) => setSportInput(e.target.value)}
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddSport}
                  sx={{ mt: 2, height: 40 }}
                >
                  Add
                </Button>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {(formData.sports || []).map((sport, index) => (
                  <Chip
                    key={index}
                    label={sport}
                    onDelete={() => handleRemoveSport(sport)}
                  />
                ))}
              </Stack>
            </Box>
 
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <TextField
              fullWidth
              label="Brochure URL (Optional)"
              value={formData.brochureUrl || ''}
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