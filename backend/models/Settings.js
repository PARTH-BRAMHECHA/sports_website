import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Create a singleton model - there will only ever be one settings document
settingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  // If no settings exist, create default settings
  return await this.create({ registrationEnabled: true });
};

export const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
