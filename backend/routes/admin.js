import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { Event } from '../models/Event.js';
import { Achievement, Gallery } from '../models/User.js';
import { 
  getAllSchedules, 
  getScheduleById, 
  getScheduleByEventId, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/scheduleController.js';

import multer from 'multer'; 

// Multer storage setup (stores image in memory before saving to DB)
const storage = multer.memoryStorage();
const upload = multer({ storage });
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
router.post('/events', verifyAdmin, async (req, res) => {
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

// Schedule routes
router.get('/schedules', async (req, res) => {
  await getAllSchedules(req, res);
});

router.get('/schedules/:id', async (req, res) => {
  await getScheduleById(req, res);
});

router.get('/schedules/event/:eventId', async (req, res) => {
  await getScheduleByEventId(req, res);
});

router.post('/schedules', verifyAdmin, async (req, res) => {
  await createSchedule(req, res);
});

router.put('/schedules/:id', verifyAdmin, async (req, res) => {
  await updateSchedule(req, res);
});

router.delete('/schedules/:id', verifyAdmin, async (req, res) => {
  await deleteSchedule(req, res);
});

router.post('/achievements', verifyAdmin, async (req, res) => {
  try {
    console.log('Creating achievements:', req.body);
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json({ message: 'Achievement created successfully', achievement });
    console.log("HI")
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upload Image Route
router.post('/gallery', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('Received gallery data:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { title, description } = req.body;

    // Create and save image in DB
    const newImage = new Gallery({
      title,
      description,
      image: {
        data: req.file.buffer, // Store image as binary
        contentType: req.file.mimetype, // Store image type
      },
      user: req.user.id, // Assuming req.user is populated by authentication middleware
    });

    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully', image: newImage });

    console.log('Gallery image uploaded successfully');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: error.message });
  }
  console.log("Hi the galeery is working")
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    console.log('Retrieved achievements from DB:', achievements.length);
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/events/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/events/:id', verifyAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;