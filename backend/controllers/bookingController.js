import { Ride, Booking, User } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Create a new booking and reduce available seats
// @route   POST /api/bookings
// @access  Private




import Razorpay from 'razorpay';
import crypto from 'crypto';

const getRazKeyId = () => {
    return process.env.RAZORPAY_KEY_ID;
};

const getRazKeySecret = () => {
    return process.env.RAZORPAY_KEY_SECRET;
};



// @desc    Verify Razorpay Payment and Confirm Booking
// @route   POST /api/bookings/verify
// @access  Private
export const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Construct the expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const secret = getRazKeySecret();
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is legit. Now update the corresponding booking.
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.status === 'confirmed') {
                return res.status(400).json({ success: false, message: 'Booking already confirmed' });
            }

            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            await booking.save();

            // Deduct the seats from the associated Ride securely
            const ride = await Ride.findByPk(booking.rideId);
            if (ride) {
                ride.availableSeats -= booking.seatsBooked;
                await ride.save();
            }

            return res.status(200).json({ success: true, message: "Payment Successful, seat booked!" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Payment Signature" });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Server Error: Failed to verify payment' });
    }
};



export const createBooking = async (req, res) => {
    try {
        const { rideId, seatsBooked, totalPrice } = req.body;
        const passengerId = req.user.id;

        // Find the ride
        const ride = await Ride.findByPk(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // Check if rides has enough available seats
        // We do this check here but we only officially deduct once payment goes through
        if (ride.availableSeats < seatsBooked) {
            return res.status(400).json({ success: false, message: 'Not enough seats available' });
        }

        // Check if the driver is trying to book their own ride
        if (ride.driverId === passengerId) {
            return res.status(400).json({ success: false, message: 'Driver cannot book their own ride' });
        }

        // Create Razorpay Order FIRST to ensure payments work before booking seats
        const razorpayInstance = new Razorpay({
            key_id: getRazKeyId(),
            key_secret: getRazKeySecret(),
        });

        const receiptId = `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const options = {
            amount: Math.round(totalPrice * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: receiptId,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // If Razorpay succeeds, we THEN create the booking as 'pending'
        const booking = await Booking.create({
            rideId,
            passengerId,
            seatsBooked,
            totalPrice,
            status: 'pending', // important: pending until payment is verified
            paymentStatus: 'pending' // track payment independently
        });

        res.status(201).json({
            success: true,
            message: 'Booking initialized',
            data: {
                booking,
                razorpayOrder
            }
        });

    } catch (error) {
        console.error('================ Razorpay/Booking Error ================');
        console.error(error);
        console.error('========================================================');

        let errorMsg = 'Server Error: Failed to initialize booking. Please check if payment gateway is working.';
        if (error.error && error.error.description) {
            errorMsg = error.error.description;
        } else if (error.message) {
            errorMsg = error.message;
        }

        res.status(500).json({
            success: false,
            message: errorMsg,
            error: error
        });
    }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
// export const getMyBookings = async (req, res) => {
//     try {
//         const passengerId = req.user.id;
//         const pageNum = parseInt(req.query.page) || 1;
//         const limitNum = parseInt(req.query.limit) || 20;
//         const offset = (pageNum - 1) * limitNum;

//         const { count, rows: bookings } = await Booking.findAndCountAll({
//             where: { passengerId },
//             limit: limitNum,
//             offset: offset,
//             include: [
//                 {
//                     model: Ride,
//                     as: 'ride',
//                     include: [
//                         {
//                             model: User,
//                             as: 'driver',
//                             attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'profilePicture']
//                         }
//                     ]
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });

//         res.status(200).json({
//             success: true,
//             count: bookings.length,
//             total: count,
//             page: pageNum,
//             totalPages: Math.ceil(count / limitNum),
//             data: bookings
//         });
//     } catch (error) {
//         console.error('Error fetching my bookings:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server Error: Failed to fetch bookings'
//         });
//     }
// };
export const getMyBookings = async (req, res) => {
    try {
        const passengerId = req.user.id;
        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows: bookings } = await Booking.findAndCountAll({
            where: {
                passengerId,
                paymentStatus: 'paid'   // ✅ only paid bookings
            },
            limit: limitNum,
            offset: offset,
            include: [
                {
                    model: Ride,
                    as: 'ride',
                    include: [
                        {
                            model: User,
                            as: 'driver',
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'phoneNumber',
                                'profilePicture'
                            ]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            data: bookings
        });

    } catch (error) {
        console.error('Error fetching my bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch bookings'
        });
    }
};
// @desc    Cancel a booking by passenger
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const passengerId = req.user.id;

        // Find the booking that belongs to this user
        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                passengerId
            },
            include: [{ model: Ride, as: 'ride' }]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found or unauthorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
        }

        // Parent ride is already cancelled
        if (booking.ride.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Parent ride has been cancelled by the driver' });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Restore the seats to the parent ride
        const ride = booking.ride;
        ride.availableSeats += booking.seatsBooked;
        await ride.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to cancel booking'
        });
    }
};


export const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Ensure user is the passenger
        if (booking.passengerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ success: false, message: 'Only confirmed bookings can be marked as complete' });
        }

        booking.status = 'completed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking marked as completed successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error completing booking:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to complete booking'
        });
    }
};

// @desc    Get passenger payment history
// @route   GET /api/bookings/payment-history/user
// @access  Private
export const getUserPaymentHistory = async (req, res) => {
    try {
        const passengerId = req.user.id;
        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows: bookings } = await Booking.findAndCountAll({
            where: { passengerId },
            limit: limitNum,
            offset: offset,
            include: [{
                model: Ride,
                as: 'ride',
                attributes: ['origin', 'destination', 'departureTime']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user payment history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
    }
};

// @desc     Get driver payment history (earnings)
// @route   GET /api/bookings/payment-history/driver
// @access  Private
export const getDriverPaymentHistory = async (req, res) => {
    try {
        const driverId = req.user.id;
        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows: bookings } = await Booking.findAndCountAll({
            limit: limitNum,
            offset: offset,
            include: [{
                model: Ride,
                as: 'ride',
                where: { driverId },
                attributes: ['origin', 'destination', 'departureTime']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching driver payment history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
    }
};
