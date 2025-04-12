import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const ManageSettings = () => {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    googleCalendarId: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/admin/settings",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleToggleRegistration = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const updatedRegistrationStatus = !settings.registrationEnabled;

      await axios.put(
        "http://localhost:4000/api/admin/settings",
        { registrationEnabled: updatedRegistrationStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSettings({
        ...settings,
        registrationEnabled: updatedRegistrationStatus,
      });

      setSuccess(
        `Registration has been ${
          updatedRegistrationStatus ? "enabled" : "disabled"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCalendarIdChange = (e) => {
    setSettings({
      ...settings,
      googleCalendarId: e.target.value,
    });
  };

  const saveCalendarId = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await axios.put(
        "http://localhost:4000/api/admin/settings",
        { googleCalendarId: settings.googleCalendarId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSuccess("Google Calendar ID has been updated successfully");
    } catch (error) {
      console.error("Error updating calendar ID:", error);
      setError("Failed to update Google Calendar ID. Please try again.");
    } finally {
      setUpdating(false);
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
      <Typography variant="h4" gutterBottom>
        Site Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {" "}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ py: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.registrationEnabled}
                      onChange={handleToggleRegistration}
                      color="primary"
                      disabled={updating}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {settings.registrationEnabled
                          ? "Registration is Currently Enabled"
                          : "Registration is Currently Disabled"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {settings.registrationEnabled
                          ? "Users can register for events"
                          : "Users cannot register for events"}
                      </Typography>
                    </Box>
                  }
                />
                {updating && <CircularProgress size={24} sx={{ ml: 2 }} />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Google Calendar Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ py: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}>
                  Enter your Google Calendar ID to display events on the
                  calendar widget. The ID format typically looks like:{" "}
                  <code>example@group.calendar.google.com</code>
                </Typography>

                <TextField
                  fullWidth
                  label="Google Calendar ID"
                  variant="outlined"
                  value={settings.googleCalendarId || ""}
                  onChange={handleCalendarIdChange}
                  margin="normal"
                  helperText="Make sure your Google Calendar is set to public for proper display"
                />

                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveCalendarId}
                    disabled={updating}>
                    Save Calendar ID
                  </Button>
                  {updating && <CircularProgress size={24} sx={{ ml: 2 }} />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageSettings;
