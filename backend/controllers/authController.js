import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Ride } from '../models/index.js';
import { uploadToCloudinary } from '../utils/coudinary.js';

export const register = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, role,
            dateOfBirth, gender, phoneNumber, address
        } = req.body;

        if (!email || !password || !firstName || !lastName || !role || !dateOfBirth || !gender || !phoneNumber || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let profilePicture = null;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'profile_pictures', 'image');
            profilePicture = uploadResult.secure_url;
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            role: role || 'user',
            profilePicture,
            dateOfBirth,
            gender,
            phoneNumber,
            address
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                dateOfBirth: newUser.dateOfBirth,
                gender: newUser.gender,
                phoneNumber: newUser.phoneNumber,
                address: newUser.address,
                profilePicture: newUser.profilePicture
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate role matches
        if (role && user.role !== role) {
            return res.status(400).json({ message: `Access denied. Invalid credentials for selected role.` });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert to plain object to attach fallback properties without affecting DB model
        const userData = req.user.toJSON();

        // If user is missing driver details, try to fetch from their last ride as fallback
        if (!userData.vehicleModel || !userData.registrationNumber || !userData.bankAccount || !userData.aadharCard) {
            const lastRide = await Ride.findOne({
                where: { driverId: req.user.id },
                order: [['createdAt', 'DESC']]
            });

            if (lastRide) {
                // Merge in previous ride details if they were not explicitly saved to the User yet
                userData.vehicleModel = userData.vehicleModel || lastRide.carName;
                userData.registrationNumber = userData.registrationNumber || lastRide.carNumber;
                userData.bankAccount = userData.bankAccount || lastRide.accountNumber;
                userData.ifscCode = userData.ifscCode || lastRide.ifscCode;
                userData.aadharCard = userData.aadharCard || lastRide.aadharCard;
                userData.licenseNumber = userData.licenseNumber || lastRide.drivingLicense;
            }
        }

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phoneNumber, gender, address, profilePicture } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Only update provided fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (address) user.address = address;
        if (gender) user.gender = gender.toLowerCase();
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (profilePicture) user.profilePicture = profilePicture;

        // Handle gender mapping (Removed because User model does not have a gender column)

        // Handle profile picture — upload to Cloudinary
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'profile_pictures', 'image');
            user.profilePicture = uploadResult.secure_url;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                address: user.address,
                profilePicture: user.profilePicture,
                phoneNumber: user.phoneNumber,
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error: Failed to update profile' });
    }
};

export const getLoginUserDetails = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = req.user.toJSON();

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Get login user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for this email' });
        }
        res.status(200).json({ success: true, message: 'Email confirmed' });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({ success: false, message: 'Server error checkEmail' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = passwordHash;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error resetPassword' });
    }
};
