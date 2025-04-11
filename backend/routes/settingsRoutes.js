import express from 'express';
import { getRegistrationStatus } from '../controllers/settingsController.js';

const router = express.Router();

// Public routes
router.get('/registration-status', getRegistrationStatus);

export default router;
