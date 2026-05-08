import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import cityRoutes from './routes/cityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.get('/', (req, res) => {
    res.send('Carpooling API is running!');
});

app.use('/api/cities', cityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

// Sync DB and Start Server
sequelize.sync() // Removed { alter: true } to prevent constraint drop crashes on Postgres
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });