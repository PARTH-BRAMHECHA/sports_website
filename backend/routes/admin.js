import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { Event } from '../models/Event.js';

const router = express.Router();

// Test route - no authentication required
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Admin routes are working!' });
});

// Authentication test endpoint
router.get('/check-auth', verifyAdmin, (req, res) => {
  res.status(200).json({ message: "Admin authenticated successfully", user: req.user });
});

// Event routes - these match what your frontend is calling
router.post('/admin/events', verifyAdmin, async (req, res) => {
  try {
    console.log('Creating event:', req.body);
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/admin/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/events/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/admin/events/:id', verifyAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;