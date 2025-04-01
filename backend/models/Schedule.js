import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sport', 'ceremony', 'cultural'],
    default: 'sport'
  }
});

const scheduleDaySchema = new mongoose.Schema({
  dayName: {
    type: String,
    required: true,
    trim: true
  },
  events: [scheduleItemSchema]
});

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  days: [scheduleDaySchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);