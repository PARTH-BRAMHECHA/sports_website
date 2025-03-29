import { Registration } from '../models/Registration.js';

// Create a new team registration
export const createRegistration = async (req, res) => {
  try {
    const { 
      collegeName, 
      teamName, 
      sport, 
      captainName, 
      email, 
      phone, 
      teamSize, 
      alternateContact 
    } = req.body;

    // Validate required fields
    if (!collegeName || !teamName || !sport || !captainName || !email || !phone || !teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newRegistration = new Registration({
      collegeName,
      teamName,
      sport,
      captainName,
      email,
      phone,
      teamSize: Number(teamSize),
      alternateContact
    });

    await newRegistration.save();

    return res.status(201).json({
      success: true,
      message: 'Team registration successful',
      data: newRegistration
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

// Get all team registrations (for admin)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    
    return res.status(200).json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }
    
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Registration ${status}`,
      data: updatedRegistration
    });
  } catch (error) {
    console.error('Update registration status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};