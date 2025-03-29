import express from 'express';
import { createRegistration, getAllRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for team registration
router.post('/register', createRegistration);

// Admin routes (protected)
router.get('/', authenticate, verifyAdmin, getAllRegistrations);
router.patch('/:id/status', authenticate, verifyAdmin, updateRegistrationStatus);

export default router;