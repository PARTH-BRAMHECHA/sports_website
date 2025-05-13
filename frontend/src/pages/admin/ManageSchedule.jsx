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
  IconButton,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ManageSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventId: "",
    days: [],
  });

  // Event form for adding/editing a single event in a day
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(null);
  const [eventForm, setEventForm] = useState({
    time: "",
    event: "",
    venue: "",
    type: "sport",
  });

  useEffect(() => {
    fetchSchedules();
    fetchEvents();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      console.log("Fetching schedules...");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/schedules`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("API Response:", response);

      // Ensure we always have an array of schedules
      let schedulesArray = [];

      if (Array.isArray(response.data)) {
        schedulesArray = response.data;
      } else if (response.data && typeof response.data === "object") {
        // If single object was returned (not in an array)
        if (response.data._id) {
          schedulesArray = [response.data];
        } else if (
          response.data.schedules &&
          Array.isArray(response.data.schedules)
        ) {
          // If schedules are nested in a property
          schedulesArray = response.data.schedules;
        }
      }

      console.log("Processed schedules array:", schedulesArray);
      setSchedules(schedulesArray);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load schedules. Please try again.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/events`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      let eventsArray = [];
      if (Array.isArray(response.data)) {
        eventsArray = response.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.events
      ) {
        eventsArray = response.data.events;
      }

      setEvents(eventsArray);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleOpen = (schedule = null) => {
    setError("");
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData({
        title: schedule.title || "",
        description: schedule.description || "",
        eventId: schedule.eventId || "",
        days: schedule.days || [],
      });
    } else {
      setSelectedSchedule(null);
      setFormData({
        title: "",
        description: "",
        eventId: "",
        days: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
    setError("");
  };

  // Add a new day to the schedule
  const handleAddDay = () => {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        {
          dayName: `Day ${formData.days.length + 1}`,
          events: [],
        },
      ],
    });
  };

  // Remove a day from the schedule
  const handleRemoveDay = (dayIndex) => {
    const updatedDays = formData.days.filter((_, index) => index !== dayIndex);
    setFormData({
      ...formData,
      days: updatedDays,
    });
  };

  // Handle day name change
  const handleDayNameChange = (dayIndex, newName) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].dayName = newName;
    setFormData({
      ...formData,
      days: updatedDays,
    });
  };

  // Open the event dialog for adding/editing an event
  const handleOpenEventDialog = (dayIndex, eventIndex = null) => {
    setCurrentDayIndex(dayIndex);
    setCurrentEventIndex(eventIndex);

    if (eventIndex !== null) {
      // Editing an existing event
      const event = formData.days[dayIndex].events[eventIndex];
      setEventForm({
        time: event.time || "",
        event: event.event || "",
        venue: event.venue || "",
        type: event.type || "sport",
      });
    } else {
      // Adding a new event
      setEventForm({
        time: "",
        event: "",
        venue: "",
        type: "sport",
      });
    }

    setEventDialogOpen(true);
  };

  // Close the event dialog
  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
    setCurrentDayIndex(null);
    setCurrentEventIndex(null);
  };

  // Save an event to a day
  const handleSaveEvent = () => {
    const updatedDays = [...formData.days];

    if (currentEventIndex !== null) {
      // Update existing event
      updatedDays[currentDayIndex].events[currentEventIndex] = eventForm;
    } else {
      // Add new event
      updatedDays[currentDayIndex].events.push(eventForm);
    }

    setFormData({
      ...formData,
      days: updatedDays,
    });

    handleCloseEventDialog();
  };

  // Remove an event from a day
  const handleRemoveEvent = (dayIndex, eventIndex) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].events = updatedDays[dayIndex].events.filter(
      (_, index) => index !== eventIndex
    );

    setFormData({
      ...formData,
      days: updatedDays,
    });
  };

  // Handle accordion expansion
  const handleAccordionChange = (dayIndex) => (event, isExpanded) => {
    setExpandedDay(isExpanded ? dayIndex : null);
  };

  // Submit the form to create/update a schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSchedule) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/schedules/${
            selectedSchedule._id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/schedules`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      }
      fetchSchedules();
      handleClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while saving the schedule"
      );
    }
  };

  // Delete a schedule
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/schedules/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        fetchSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        setError("Failed to delete schedule");
      }
    }
  };

  // Get event name by ID
  const getEventNameById = (id) => {
    const event = events.find((e) => e._id === id);
    return event ? event.title : "Unknown Event";
  };

  // Get chip color for event type
  const getChipColor = (type) => {
    switch (type) {
      case "sport":
        return "primary";
      case "ceremony":
        return "success";
      case "cultural":
        return "secondary";
      default:
        return "default";
    }
  };

  // Initialize with default schedule data
  const handleInitializeData = async () => {
    try {
      // Default schedule based on the ElevateSchedule component's fallback data
      const defaultSchedule = {
        title: "Elevate Sports Festival",
        description: "Official schedule for the Elevate sports festival",
        days: [
          {
            dayName: "Day 1",
            events: [
              {
                time: "08:00 AM",
                event: "Opening Ceremony",
                venue: "Main Ground",
                type: "ceremony",
              },
              {
                time: "09:30 AM",
                event: "Basketball Preliminaries",
                venue: "Basketball Court",
                type: "sport",
              },
              {
                time: "10:00 AM",
                event: "Table Tennis Round 1",
                venue: "Indoor Hall",
                type: "sport",
              },
              {
                time: "02:00 PM",
                event: "Volleyball Preliminaries",
                venue: "Volleyball Court",
                type: "sport",
              },
              {
                time: "04:00 PM",
                event: "Chess Tournament Start",
                venue: "Academic Block",
                type: "sport",
              },
            ],
          },
          {
            dayName: "Day 2",
            events: [
              {
                time: "09:00 AM",
                event: "Cricket Quarter Finals",
                venue: "Cricket Ground",
                type: "sport",
              },
              {
                time: "10:00 AM",
                event: "Basketball Semi Finals",
                venue: "Basketball Court",
                type: "sport",
              },
              {
                time: "02:00 PM",
                event: "Cultural Performance",
                venue: "Main Stage",
                type: "cultural",
              },
              {
                time: "03:30 PM",
                event: "Table Tennis Finals",
                venue: "Indoor Hall",
                type: "sport",
              },
            ],
          },
          {
            dayName: "Day 3",
            events: [
              {
                time: "09:00 AM",
                event: "Cricket Finals",
                venue: "Cricket Ground",
                type: "sport",
              },
              {
                time: "11:00 AM",
                event: "Basketball Finals",
                venue: "Basketball Court",
                type: "sport",
              },
              {
                time: "02:00 PM",
                event: "Volleyball Finals",
                venue: "Volleyball Court",
                type: "sport",
              },
              {
                time: "05:00 PM",
                event: "Prize Distribution",
                venue: "Main Stage",
                type: "ceremony",
              },
              {
                time: "06:30 PM",
                event: "Closing Ceremony",
                venue: "Main Stage",
                type: "ceremony",
              },
            ],
          },
        ],
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/schedules`,
        defaultSchedule,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      fetchSchedules();
    } catch (error) {
      console.error("Error initializing data:", error);
      setError("Failed to initialize schedule data");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Event Schedules</Typography>
        <Box>
          {Array.isArray(schedules) && schedules.length === 0 && (
            <Button
              variant="outlined"
              onClick={handleInitializeData}
              sx={{ mr: 2 }}>
              Initialize with Default Data
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}>
            Create New Schedule
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!Array.isArray(schedules) ? (
        <Alert severity="error">
          There was an issue loading the schedules data. Please try refreshing
          the page.
        </Alert>
      ) : schedules.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule._id || Math.random().toString()}>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell>{schedule.description}</TableCell>
                  <TableCell>
                    {schedule.eventId
                      ? getEventNameById(schedule.eventId)
                      : "General"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(schedule.days) ? schedule.days.length : 0}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(schedule)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(schedule._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>
            No schedules found. Create your first schedule!
          </Typography>
        </Paper>
      )}

      {/* Dialog for creating/editing a schedule */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedSchedule
            ? "Edit Event Schedule"
            : "Create New Event Schedule"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Box sx={{ color: "error.main", mb: 2 }}>{error}</Box>}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Schedule Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="event-select-label">
                    Associated Event (Optional)
                  </InputLabel>
                  <Select
                    labelId="event-select-label"
                    value={formData.eventId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, eventId: e.target.value })
                    }
                    label="Associated Event (Optional)">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {Array.isArray(events) &&
                      events.map((event) => (
                        <MenuItem key={event._id} value={event._id}>
                          {event.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={2}
            />

            <Box sx={{ mt: 3, mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography variant="h6">Schedule Days</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddDay}
                  variant="outlined"
                  size="small">
                  Add Day
                </Button>
              </Box>

              {!formData.days || formData.days.length === 0 ? (
                <Paper
                  sx={{
                    p: 2,
                    mt: 1,
                    textAlign: "center",
                    bgcolor: "action.hover",
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    No days added yet. Click "Add Day" to start building your
                    schedule.
                  </Typography>
                </Paper>
              ) : (
                formData.days.map((day, dayIndex) => (
                  <Accordion
                    key={dayIndex}
                    expanded={expandedDay === dayIndex}
                    onChange={handleAccordionChange(dayIndex)}
                    sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          pr: 2,
                        }}>
                        <TextField
                          value={day.dayName || ""}
                          onChange={(e) =>
                            handleDayNameChange(dayIndex, e.target.value)
                          }
                          variant="standard"
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          sx={{ width: "200px" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {day.events && day.events.length}{" "}
                          {day.events && day.events.length === 1
                            ? "event"
                            : "events"}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => handleOpenEventDialog(dayIndex)}
                          variant="outlined"
                          size="small">
                          Add Event
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveDay(dayIndex)}
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}>
                          Remove Day
                        </Button>
                      </Box>

                      {!day.events || day.events.length === 0 ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}>
                          No events added for this day yet.
                        </Typography>
                      ) : (
                        <List>
                          {day.events.map((event, eventIndex) => (
                            <div key={eventIndex}>
                              <ListItem
                                secondaryAction={
                                  <Box>
                                    <IconButton
                                      edge="end"
                                      onClick={() =>
                                        handleOpenEventDialog(
                                          dayIndex,
                                          eventIndex
                                        )
                                      }>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      edge="end"
                                      onClick={() =>
                                        handleRemoveEvent(dayIndex, eventIndex)
                                      }>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                }>
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}>
                                      <Typography
                                        variant="body2"
                                        component="span"
                                        sx={{
                                          fontWeight: "bold",
                                          minWidth: "80px",
                                        }}>
                                        {event.time}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        component="span">
                                        {event.event}
                                      </Typography>
                                      <Chip
                                        label={event.type}
                                        color={getChipColor(event.type)}
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    </Box>
                                  }
                                  secondary={`Venue: ${event.venue}`}
                                />
                              </ListItem>
                              {eventIndex < day.events.length - 1 && (
                                <Divider />
                              )}
                            </div>
                          ))}
                        </List>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.days || formData.days.length === 0}>
              {selectedSchedule ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for adding/editing an event within a day */}
      <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog}>
        <DialogTitle>
          {currentEventIndex !== null ? "Edit Event" : "Add New Event"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: "400px" }}>
          <TextField
            fullWidth
            label="Time"
            value={eventForm.time || ""}
            onChange={(e) =>
              setEventForm({ ...eventForm, time: e.target.value })
            }
            margin="normal"
            placeholder="e.g., 09:00 AM"
            required
          />

          <TextField
            fullWidth
            label="Event Name"
            value={eventForm.event || ""}
            onChange={(e) =>
              setEventForm({ ...eventForm, event: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Venue"
            value={eventForm.venue || ""}
            onChange={(e) =>
              setEventForm({ ...eventForm, venue: e.target.value })
            }
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={eventForm.type || "sport"}
              onChange={(e) =>
                setEventForm({ ...eventForm, type: e.target.value })
              }
              label="Event Type">
              <MenuItem value="sport">Sport</MenuItem>
              <MenuItem value="ceremony">Ceremony</MenuItem>
              <MenuItem value="cultural">Cultural</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageSchedule;
