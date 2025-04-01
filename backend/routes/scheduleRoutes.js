import express from 'express';
import { 
  getAllSchedules, 
  getScheduleById, 
  getScheduleByEventId
} from '../controllers/scheduleController.js';

const router = express.Router();

// Public routes for accessing schedule data
router.get('/', async (req, res) => {
  await getAllSchedules(req, res);
});

router.get('/:id', async (req, res) => {
  await getScheduleById(req, res);
});

router.get('/event/:eventId', async (req, res) => {
  await getScheduleByEventId(req, res);
});

export default router;