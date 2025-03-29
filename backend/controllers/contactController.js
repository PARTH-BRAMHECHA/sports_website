import Contact from '../models/Contact.js';

// Create a new contact form submission
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, sport, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !sport || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      phone,
      sport,
      message
    });

    await newContact.save();

    // Could add email notification here using the email utility

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

// Get all contact form submissions (for admin)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

// Mark contact message as read
export const markContactAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updatedContact
    });
  } catch (error) {
    console.error('Mark contact as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};

// Delete contact message
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};