import express from 'express';
import { createContact, getAllContacts, markContactAsRead, deleteContact } from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createContact);

// Admin routes (protected)
router.get('/', authenticate, getAllContacts);
router.patch('/:id/read', authenticate, markContactAsRead);
router.delete('/:id', authenticate, deleteContact);

export default router;