import express from 'express';
import { createContact, getAllContacts } from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createContact);

// Admin routes (protected)
router.get('/', authenticate, getAllContacts);

export default router;