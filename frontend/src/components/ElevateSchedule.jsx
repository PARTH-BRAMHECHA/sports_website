import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

// Fallback data in case API call fails
const fallbackSchedule = {
  "Day 1": [
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
  "Day 2": [
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
  "Day 3": [
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
};

const ElevateSchedule = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // Use the public API endpoint instead of the admin one
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/schedules`
        );
        console.log("Schedule API response:", response.data);

        if (response.data && response.data.length > 0) {
          // Transform the data to match our component's format
          const transformedData = {};
          response.data[0].days.forEach((day) => {
            transformedData[day.dayName] = day.events;
          });
          setSchedule(transformedData);
        } else {
          console.log("No schedule data found, using fallback data");
          setSchedule(fallbackSchedule);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to load schedule data");
        console.log("Using fallback schedule data due to error");
        setSchedule(fallbackSchedule);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedDay(newValue);
  };

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography color="error">No schedule data available</Typography>
      </Box>
    );
  }

  return (
    <Box id="schedule" sx={{ width: "100%", mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Event Schedule
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={selectedDay}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered>
          {Object.keys(schedule).map((day, index) => (
            <Tab key={day} label={day} id={`tab-${index}`} />
          ))}
        </Tabs>
      </Paper>

      {Object.entries(schedule).map(([day, events], index) => (
        <div
          key={day}
          role="tabpanel"
          hidden={selectedDay !== index}
          id={`tabpanel-${index}`}>
          {selectedDay === index && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event, eventIndex) => (
                    <TableRow key={eventIndex}>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>{event.event}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            event.type.charAt(0).toUpperCase() +
                            event.type.slice(1)
                          }
                          color={getChipColor(event.type)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      ))}
    </Box>
  );
};

export default ElevateSchedule;
