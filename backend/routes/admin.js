import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import * as eventController from '../controllers/eventController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Achievement Routes
router.post('/achievements', verifyAdmin, achievementController.addAchievement);
router.put('/achievements/:id', verifyAdmin, achievementController.updateAchievement);
router.delete('/achievements/:id', verifyAdmin, achievementController.deleteAchievement);
router.get('/achievements', achievementController.getAllAchievements);
router.get('/achievements/:id', achievementController.getAchievementById);

// Event Routes
router.post('/events', verifyAdmin, eventController.addEvent);
router.put('/events/:id', verifyAdmin, eventController.updateEvent);
router.delete('/events/:id', verifyAdmin, eventController.deleteEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);

export default router;