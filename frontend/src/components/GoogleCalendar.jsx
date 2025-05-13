import { useState, useEffect } from "react";
import {
  Box,
  Fab,
  Modal,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Event, Close } from "@mui/icons-material";
import axios from "axios";

const GoogleCalendar = () => {
  const [open, setOpen] = useState(false);
  const [calendarId, setCalendarId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch calendar ID when modal opens
    if (open) {
      fetchCalendarId();
    }
  }, [open]);
  const fetchCalendarId = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/settings/calendar-id`
      );
      if (data && data.googleCalendarId) {
        setCalendarId(data.googleCalendarId);
      } else {
        setError("No calendar configured. Please configure in admin settings.");
      }
    } catch (err) {
      console.error("Error fetching calendar ID:", err);
      setError("Failed to load calendar settings");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Floating button that stays fixed at bottom right */}
      <Fab
        color="primary"
        aria-label="calendar"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}>
        <Event />
      </Fab>

      {/* Calendar modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="google-calendar-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Paper
          elevation={5}
          sx={{
            width: { xs: "95%", md: "80%" },
            height: { xs: "80vh", md: "75vh" },
            maxWidth: 1200,
            p: 2,
            position: "relative",
            overflow: "hidden",
          }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Sports Calendar</Typography>
            <IconButton onClick={handleClose} edge="end">
              <Close />
            </IconButton>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90%",
              }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                height: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                height: "calc(100% - 50px)",
                width: "100%",
                overflow: "hidden",
              }}>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  calendarId
                )}&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
                style={{
                  border: "none",
                  width: "100%",
                  height: "100%",
                }}
                frameBorder="0"
                scrolling="no"
                title="Sports Events Calendar"
              />
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default GoogleCalendar;
