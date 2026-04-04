import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Ride } from '../models/index.js';

export const getforgotPassword = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        else {

        }

    } catch (error) {
        console.error("Error in forgot password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}