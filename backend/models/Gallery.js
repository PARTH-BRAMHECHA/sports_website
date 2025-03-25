import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
