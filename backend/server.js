// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth.js';

// dotenv.config();

// const app = express();

// // Comprehensive CORS setup
// const corsOptions = {
//     origin: [
//         'http://localhost:3000', 
//         'http://127.0.0.1:3000', 
//         'http://localhost:5173', 
//         '*'
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json());

// // Logging middleware
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB Connection
// const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sports_portal';

// mongoose.connect(mongoURI, { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ 
//         message: 'Something went wrong', 
//         error: err.message 
//     });
// });

// // Start Server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });