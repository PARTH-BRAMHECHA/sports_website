import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true
    },
    sport: {
      type: String,
      required: [true, 'Please select a sport interest'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Contact', ContactSchema);