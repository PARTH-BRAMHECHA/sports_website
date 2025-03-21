import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  sports: [{
    type: String,
    trim: true
  }],
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  brochureUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// ✅ Prevent Overwriting the Model
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

// export default Event;
