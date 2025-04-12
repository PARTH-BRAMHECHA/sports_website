import express from "express";
import {
  getRegistrationStatus,
  getCalendarId,
} from "../controllers/settingsController.js";

const router = express.Router();

// Public routes
router.get("/registration-status", getRegistrationStatus);
router.get("/calendar-id", getCalendarId);

export default router;
