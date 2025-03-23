import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sports_website';

try {
  await mongoose.connect(uri);
  console.log('MongoDB connection established');
} catch (err) {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sports Website API' });
});

// Start server
const PORT = process.env.PORT || 5001;  // Changed default to 5001

// Check if port is in use and try the next available port
const startServer = async () => {
  try {
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
      await app.listen(PORT + 1);
      console.log(`Server is running on port ${PORT + 1}`);
    } else {
      console.error('Server error:', err);
    }
  }
};

startServer(); 