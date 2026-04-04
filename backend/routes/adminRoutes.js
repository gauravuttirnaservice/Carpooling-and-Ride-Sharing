import express from 'express';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    verifyAadhar,
    getAllRides,
    getAllRideswithDriver,
    getRidesDetails,
    forceCancelRide,
    verifyDriver,
    getAllBookings,

    deleteCity,
    getAllCities,
    createCityWithPoints,
    getAllReviews,
    moderateReview
} from '../controllers/adminController/dashboardController.js';

const router = express.Router();

// Apply auth and admin check to all routes
router.use(protect, isAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/verify-aadhar", verifyAadhar);

// Rides
router.get("/rides", getAllRides);
router.get("/rides-with-driver", getAllRideswithDriver);
router.get("/rides/:id", getRidesDetails);
router.put("/rides/:id/cancel", forceCancelRide);
router.put("/rides/:id/verify-driver", verifyDriver);
router.post("/cities-with-points", createCityWithPoints);

// Bookings
router.get("/bookings", getAllBookings);

// Cities
router.get("/cities", getAllCities);

router.delete("/cities/:id", deleteCity);

// Reviews
router.get("/reviews", getAllReviews);
router.put("/reviews/:id/moderate", moderateReview);

export default router;