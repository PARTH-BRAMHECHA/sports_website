import { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TablePagination,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MarkEmailRead as MarkEmailReadIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:4000/api/contact', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load contact messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/contact/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Failed to mark message as read. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:4000/api/contact/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        setError('Failed to delete message. Please try again.');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isMessageRead = (message) => {
    return message.status === 'read' || message.status === 'responded';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading messages...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {messages.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No contact messages found.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Sport</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.sport}</TableCell>
                    <TableCell>
                      <Chip
                        label={isMessageRead(message) ? 'Read' : 'Unread'}
                        color={isMessageRead(message) ? 'default' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => setSelectedMessage(message)}>
                        <VisibilityIcon />
                      </IconButton>
                      {!isMessageRead(message) && (
                        <IconButton onClick={() => handleMarkAsRead(message._id)}>
                          <MarkEmailReadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(message._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={messages.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}

      <Dialog
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Message Details</DialogTitle>
        {selectedMessage && (
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              From: {selectedMessage.name}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Email: {selectedMessage.email}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Phone: {selectedMessage.phone}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Sport: {selectedMessage.sport}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Date: {new Date(selectedMessage.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Status: {selectedMessage.status === 'new' ? 'Unread' : 
                      selectedMessage.status === 'responded' ? 'Responded' : 'Read'}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Message:
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedMessage.message}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setSelectedMessage(null)}>Close</Button>
          {selectedMessage && !isMessageRead(selectedMessage) && (
            <Button
              onClick={() => {
                handleMarkAsRead(selectedMessage._id);
                setSelectedMessage(null);
              }}
              color="primary"
              variant="contained"
            >
              Mark as Read
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactMessages;