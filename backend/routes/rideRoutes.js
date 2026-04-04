import express from 'express';
import { offerRide, getActiveRides, getMyRides, getAllRides, updateRide, getRideById, cancelRide } from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadRideDocuments } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getActiveRides);

router.route('/all')
    .get(getAllRides);

router.route('/offer')
    .post(protect, uploadRideDocuments, offerRide);

router.route('/my-rides')
    .get(protect, getMyRides);

router.route('/:id')
    .get(getRideById)
    .put(protect, updateRide);

router.route('/:id/cancel')
    .put(protect, cancelRide);

export default router;
