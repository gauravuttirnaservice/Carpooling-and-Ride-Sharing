import express from 'express';
import { createBooking, verifyRazorpay, getMyBookings, cancelBooking, completeBooking, getUserPaymentHistory, getDriverPaymentHistory } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createBooking);

router.route('/verify')
    .post(protect, verifyRazorpay);

router.route('/my-bookings')
    .get(protect, getMyBookings);

router.route('/payment-history/user')
    .get(protect, getUserPaymentHistory);

router.route('/payment-history/driver')
    .get(protect, getDriverPaymentHistory);

router.route('/:id/cancel')
    .put(protect, cancelBooking);

router.route('/:id/complete')
    .put(protect, completeBooking);

export default router;
