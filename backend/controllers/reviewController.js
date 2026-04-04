import { Review, Ride, Booking, User } from '../models/index.js';

// @desc    Create a review for a completed ride
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { rideId, rating, comment } = req.body;
        const passengerId = req.user.id;

        // 1. Validate Input
        if (!rideId || !rating) {
            return res.status(400).json({ success: false, message: 'Ride ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        // 2. Ensure Ride Exists
        const ride = await Ride.findByPk(rideId);
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // 3. Ensure the User was actually a passenger on this ride and their booking is completed
        const booking = await Booking.findOne({
            where: {
                rideId: rideId,
                passengerId: passengerId,
                status: 'confirmed',
                paymentStatus: 'paid'
            }
        });

        if (!booking) {
            return res.status(403).json({ success: false, message: 'You cannot review a ride you did not take' });
        }

        // 4. Check for duplicate reviews from the same passenger for the same ride
        const existingReview = await Review.findOne({
            where: {
                rideId: rideId,
                reviewerId: passengerId
            }
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this ride' });
        }

        // 5. Create the Review
        const review = await Review.create({
            rideId: rideId,
            reviewerId: passengerId,
            revieweeId: ride.driverId,
            rating: rating,
            comment: comment || null
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to submit review'
        });
    }
};
