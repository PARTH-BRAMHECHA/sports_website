import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { sendOTPEmail } from '../utils/email.js';

// Register a new user
export const register = async (req, res) => {
    try {
        const { name, email, password, userType, studentId } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create and save new user
        // No need to hash password here, the pre-save hook will handle it
        user = new User({
            name,
            email,
            password, // The password will be hashed by the pre-save hook
            userType,
            studentId,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        console.log("Login Attempt:", req.body);

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Found User:", user);

        // Verify password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check user type
        if (user.userType !== userType) {
            return res.status(401).json({ message: "Invalid user type" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET, // Ensure you have this in your `.env`
            { expiresIn: '7d' }
        );

        // ✅ Send token & user data
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Save OTP to user
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpiry;
        await user.save();

        // Send OTP email
        await sendOTPEmail(user.email, otp);

        res.json({ message: 'OTP sent successfully to registered email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed' });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed' });
    }
};
