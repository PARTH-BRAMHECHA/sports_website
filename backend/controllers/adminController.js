import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Achievement } from '../models/User.js';
import { Event } from '../models/Event.js';

// Add a new achievement
export const addAchievement = async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json({ message: 'Achievement added successfully', achievement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing achievement
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAchievement = await Achievement.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedAchievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json({ message: 'Achievement updated successfully', updatedAchievement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an achievement
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAchievement = await Achievement.findByIdAndDelete(id);
    if (!deletedAchievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific achievement by ID
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new event
export const addEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    
    const eventData = {
      ...req.body,
      createdBy: req.user?.id
    };
    
    const event = new Event(eventData);
    await event.save();
    
    console.log("Event saved successfully:", event);
    res.status(201).json({ message: 'Event added successfully', event });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update an existing event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event updated successfully', updatedEvent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add these placeholder functions if they don't exist
export const getAllGalleryItems = async (req, res) => {
  try {
    // Placeholder - implement actual gallery retrieval
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addGalleryItem = async (req, res) => {
  try {
    // Placeholder - implement actual gallery item addition
    res.status(201).json({ message: 'Gallery item added' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    // Placeholder - implement actual gallery item deletion
    res.status(200).json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    // Placeholder - implement actual contact messages retrieval
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markContactAsRead = async (req, res) => {
  try {
    // Placeholder - implement actual mark as read functionality
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    // Placeholder - implement actual message deletion
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
