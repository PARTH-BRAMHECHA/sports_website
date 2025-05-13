import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const statusColors = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const ManageRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState({
    show: false,
    message: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/elevate`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRegistrations(data);
      setError("");
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setError("Failed to load registrations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRegistration || !statusAction) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/elevate/${
          selectedRegistration._id
        }/status`,
        { status: statusAction },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update local state
      setRegistrations(
        registrations.map((reg) =>
          reg._id === selectedRegistration._id
            ? { ...reg, status: statusAction }
            : reg
        )
      );

      setActionSuccess({
        show: true,
        message: `Registration ${
          statusAction === "approved" ? "approved" : "rejected"
        } successfully!`,
      });

      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setActionSuccess({ show: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating registration status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setDialogOpen(false);
      setSelectedRegistration(null);
      setStatusAction("");
    }
  };

  const openStatusDialog = (registration, action) => {
    setSelectedRegistration(registration);
    setStatusAction(action);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRegistration(null);
    setStatusAction("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Team Registrations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {actionSuccess.show && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionSuccess.message}
        </Alert>
      )}

      {registrations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No team registrations found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Sport</TableCell>
                <TableCell>Captain</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Team Size</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration._id}>
                  <TableCell>{registration.teamName}</TableCell>
                  <TableCell>{registration.collegeName}</TableCell>
                  <TableCell>{registration.sport}</TableCell>
                  <TableCell>{registration.captainName}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phone}</TableCell>
                  <TableCell>{registration.teamSize}</TableCell>
                  <TableCell>{formatDate(registration.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={registration.status.toUpperCase()}
                      color={statusColors[registration.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {registration.status === "pending" && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() =>
                              openStatusDialog(registration, "approved")
                            }
                            title="Approve">
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              openStatusDialog(registration, "rejected")
                            }
                            title="Reject">
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        color="primary"
                        href={`mailto:${registration.email}`}
                        title="Email Team">
                        <EmailIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {statusAction === "approved"
            ? "Approve Registration"
            : "Reject Registration"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {statusAction === "approved" ? "approve" : "reject"} the
            registration for team "{selectedRegistration?.teamName}" from{" "}
            {selectedRegistration?.collegeName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            color={statusAction === "approved" ? "success" : "error"}
            autoFocus>
            {statusAction === "approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageRegistrations;
