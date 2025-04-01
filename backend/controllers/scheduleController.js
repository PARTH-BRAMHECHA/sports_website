import { Schedule } from '../models/Schedule.js';

// Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get schedule by ID
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get schedule by event ID
export const getScheduleByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const schedule = await Schedule.findOne({ eventId });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found for this event' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const scheduleData = {
      ...req.body,
      createdBy: req.user?.id
    };
    
    const schedule = new Schedule(scheduleData);
    await schedule.save();
    
    res.status(201).json({ message: 'Schedule created successfully', schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json({ 
      message: 'Schedule updated successfully', 
      schedule: updatedSchedule 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};