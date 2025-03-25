import express from 'express';
import { getAdminStats } from '../controllers/statsController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyAdmin, getAdminStats);

export default router;