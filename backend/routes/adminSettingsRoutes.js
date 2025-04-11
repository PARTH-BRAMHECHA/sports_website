import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

// Settings routes - protected by admin auth
router.get('/settings', verifyAdmin, getSettings);
router.put('/settings', verifyAdmin, updateSettings);

export default router;
