import { Ride, User, Booking, Review } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Offer a new ride
// @route   POST /api/rides/offer
// @access  Private (Driver only)
export const offerRide = async (req, res) => {
    try {
        const {
            leavingFrom,
            goingTo,
            date,
            startTime,
            endTime,
            seats,
            price,
            accountNumber,
            ifscCode,
            carName,
            carNumber,
            aadharCard,
            originLat,
            originLng,
            destLat,
            destLng
        } = req.body;

        // Get file paths
        const drivingLicensePath = req.files?.drivingLicense ? `/uploads/${req.files.drivingLicense[0].filename}` : null;

        // Combine date and time to create departure time
        const departureDateTime = new Date(`${date}T${startTime}`);
        // Combine date and time to create arrival time
        const arrivalDateTime = new Date(`${date}T${endTime}`);

        let calculatedOriginLat = originLat ? parseFloat(originLat) : null;
        let calculatedOriginLng = originLng ? parseFloat(originLng) : null;
        let calculatedDestLat = destLat ? parseFloat(destLat) : null;
        let calculatedDestLng = destLng ? parseFloat(destLng) : null;

        try {
            if (!calculatedOriginLat || !calculatedOriginLng) {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(leavingFrom)}`, {
                    headers: { 'User-Agent': 'CarpoolingApp/1.0' }
                });
                const data = await res.json();
                if (data && data.length > 0) {
                    calculatedOriginLat = parseFloat(data[0].lat);
                    calculatedOriginLng = parseFloat(data[0].lon);
                }
            }
            if (!calculatedDestLat || !calculatedDestLng) {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(goingTo)}`, {
                    headers: { 'User-Agent': 'CarpoolingApp/1.0' }
                });
                const data = await res.json();
                if (data && data.length > 0) {
                    calculatedDestLat = parseFloat(data[0].lat);
                    calculatedDestLng = parseFloat(data[0].lon);
                }
            }
        } catch (fetchError) {
            console.error('Error fetching coordinates from Nominatim:', fetchError);
        }

        // Check if driver is already verified
        const user = await User.findByPk(req.user.id);

        // Create the ride
        const ride = await Ride.create({
            driverId: req.user.id,
            origin: leavingFrom,
            destination: goingTo,
            departureTime: departureDateTime,
            arrivalTime: arrivalDateTime,
            availableSeats: seats,
            pricePerSeat: price,
            status: 'scheduled',
            driverVerified: user.driverVerified || false,
            aadharCard,
            drivingLicense: drivingLicensePath,
            carNumber,
            ifscCode,
            carName,
            accountNumber,
            originLat: calculatedOriginLat,
            originLng: calculatedOriginLng,
            destLat: calculatedDestLat,
            destLng: calculatedDestLng
        });

        // Update the driver's default details in the User model for future use
        const updateFields = {};
        if (drivingLicensePath) updateFields.licenseNumber = drivingLicensePath; // We'll store the path or number if provided
        if (carNumber) updateFields.registrationNumber = carNumber;
        if (carName) updateFields.vehicleModel = carName;
        if (accountNumber) updateFields.bankAccount = accountNumber;
        if (ifscCode) updateFields.ifscCode = ifscCode;
        if (aadharCard) updateFields.aadharCard = aadharCard;

        if (Object.keys(updateFields).length > 0) {
            await User.update(updateFields, { where: { id: req.user.id } });
        }

        res.status(201).json({
            success: true,
            data: ride
        });

    } catch (error) {
        console.error('Error offering ride:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to offer ride',
            error: error.message
        });
    }
};

// @desc    Get all active rides (for searching)
// @route   GET /api/rides
// @access  Public
export const getActiveRides = async (req, res) => {
    try {
        const { from, to, date, passengers, priceFilter, timeSlot, sortBy, page, limit } = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const offset = (pageNum - 1) * limitNum;

        // Build the where clause
        // Only return rides that are scheduled AND where the driver's documents are verified by admin
        const whereClause = {
            status: 'scheduled',
            driverVerified: true
        };

        if (from) whereClause.origin = { [Op.iLike]: `%${from}%` };
        if (to) whereClause.destination = { [Op.iLike]: `%${to}%` };
        if (passengers) whereClause.availableSeats = { [Op.gte]: parseInt(passengers) };

        // Handle array of price filters (e.g. checkbox selections)
        if (priceFilter) {
            const prices = Array.isArray(priceFilter) ? priceFilter : [priceFilter];
            const priceConditions = prices.map(p => {
                if (p === 'under_1000') return { [Op.lt]: 1000 };
                if (p === '1000_5000') return { [Op.between]: [1000, 5000] };
                if (p === '5000_10000') return { [Op.between]: [5000, 10000] };
                if (p === '10000_20000') return { [Op.between]: [10000, 20000] };
                return null;
            }).filter(Boolean);

            if (priceConditions.length > 0) {
                whereClause.pricePerSeat = { [Op.or]: priceConditions };
            }
        }

        if (date) {
            const searchDate = new Date(date);

            // Handle array of time slots (e.g. checkbox selections)
            if (timeSlot) {
                const slots = Array.isArray(timeSlot) ? timeSlot : [timeSlot];
                const timeConditions = slots.map(slot => {
                    const start = new Date(searchDate.getTime());
                    const end = new Date(searchDate.getTime());

                    if (slot === "before_6am") {
                        start.setHours(0, 0, 0, 0);
                        end.setHours(5, 59, 59, 999);
                    } else if (slot === "6am_12pm") {
                        start.setHours(6, 0, 0, 0);
                        end.setHours(11, 59, 59, 999);
                    } else if (slot === "12pm_6pm") {
                        start.setHours(12, 0, 0, 0);
                        end.setHours(17, 59, 59, 999);
                    } else if (slot === "after_6pm") {
                        start.setHours(18, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                    }
                    return { [Op.between]: [start, end] };
                });

                if (timeConditions.length > 0) {
                    whereClause.departureTime = { [Op.or]: timeConditions };
                }
            } else {
                // If no specific time slot is checked, search the whole day
                const startOfDay = new Date(searchDate.getTime());
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(searchDate.getTime());
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.departureTime = { [Op.between]: [startOfDay, endOfDay] };
            }
        }

        // Determine ordering based on sortBy
        let orderClause = [['departureTime', 'ASC']]; // Default sorting: Earliest
        if (sortBy === 'cheapest') {
            orderClause = [['pricePerSeat', 'ASC']];
        } else if (sortBy === 'topRated') {
            // Note: If you implement ratings in DB, you would order by the average driver rating.
            // For now, sorting by driverId as a placeholder or continuing with departureTime.
            orderClause = [['departureTime', 'ASC']];
        } else if (sortBy === 'earliest') {
            orderClause = [['departureTime', 'ASC']];
        }

        const { count, rows } = await Ride.findAndCountAll({
            where: whereClause,
            order: orderClause,
            limit: limitNum,
            offset: offset,
            include: [{
                model: User,
                as: 'driver',
                attributes: ['id', 'firstName', 'lastName', 'profilePicture']
            }]
        });

        // Add dynamic rating to each driver
        const rides = [];
        for (let r of rows) {
            const rideJson = r.toJSON();
            if (rideJson.driver && rideJson.driver.id) {
                const reviews = await Review.findAll({
                    where: { revieweeId: rideJson.driver.id },
                    attributes: ['rating']
                });
                let avgRating = 0;
                if (reviews && reviews.length > 0) {
                    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                    avgRating = (sum / reviews.length).toFixed(1);
                }
                rideJson.driver.rating = Number(avgRating);
            } else if (rideJson.driver) {
                rideJson.driver.rating = 0;
            }
            rides.push(rideJson);
        }

        // Apply sorting based on dynamic rating if requested
        if (sortBy === 'topRated') {
            rides.sort((a, b) => (b.driver?.rating || 0) - (a.driver?.rating || 0));
        }

        res.status(200).json({
            success: true,
            count: rides.length,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            data: rides
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch rides'
        });
    }
};

// @desc    Get rides created by current user
// @route   GET /api/rides/my-rides
// @access  Private



export const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.findAll({
            include: [{
                model: User,
                as: 'driver',
                attributes: ['id', 'firstName', 'lastName', 'profilePicture']
            }]
        });

        res.status(200).json({
            success: true,
            count: rides.length,
            data: rides
        });
    } catch (error) {
        console.error('Error fetching all rides:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch all rides'
        });
    }
};



export const getMyRides = async (req, res) => {
    try {
        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 20;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows: rides } = await Ride.findAndCountAll({
            where: { driverId: req.user.id },
            order: [['departureTime', 'DESC']],
            limit: limitNum,
            offset: offset,
            include: [{
                model: Booking,
                as: 'bookings',
                where: {
                    status: 'confirmed',
                    paymentStatus: 'paid'
                },
                required: false, // LEFT JOIN so we still get rides with no bookings
                attributes: ['seatsBooked'],
                include: [{
                    model: User,
                    as: 'passenger',
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'profilePicture']
                }]
            },
            {
                model: Review,
                as: 'reviews',
                attributes: ['rating']
            }


            ]
        });

        // Calculate booked seats and passenger details
        const ridesWithBookingData = rides.map(ride => {
            const rideJson = ride.toJSON();
            const bookedSeats = rideJson.bookings ? rideJson.bookings.reduce((sum, booking) => sum + booking.seatsBooked, 0) : 0;

            // Calculate average rating
            let rating = 0;
            if (rideJson.reviews && rideJson.reviews.length > 0) {
                const sum = rideJson.reviews.reduce((acc, curr) => acc + curr.rating, 0);
                rating = (sum / rideJson.reviews.length).toFixed(1);
            }

            // Extract passenger details
            const passengerDetails = rideJson.bookings ? rideJson.bookings.map(booking => ({
                name: `${booking.passenger?.firstName || 'Unknown'} ${booking.passenger?.lastName || ''}`.trim(),
                phone: booking.passenger?.phoneNumber || 'N/A',
                seats: booking.seatsBooked,
                profilePicture: booking.passenger?.profilePicture || null
            })) : [];

            return {
                ...rideJson,
                bookedSeats,
                passengerDetails,
                rating
            };
        });

        // Count distinct rides (findAndCountAll might count joined rows due to left join on PostgreSQL/MySQL depending on engine, but typically correct, if not we handle it correctly)

        res.status(200).json({
            success: true,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            count: ridesWithBookingData.length,
            data: ridesWithBookingData
        });
    } catch (error) {
        console.error('Error fetching user rides:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch user rides'
        });
    }
};

// @desc    Get a single ride by ID
// @route   GET /api/rides/:id
// @access  Public
export const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'driver',
                attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'createdAt'] // Removed missing rating/totalRides fields
            }]
        });

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // Fetch driver's reviews to calculate average rating
        const reviews = await Review.findAll({
            where: { revieweeId: ride.driverId },
            include: [{
                model: User,
                as: 'reviewer',
                attributes: ['id', 'firstName', 'lastName', 'profilePicture']
            }],
            order: [['createdAt', 'DESC']]
        });

        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        // Fetch total rides offered by the driver
        const totalRides = await Ride.count({
            where: { driverId: ride.driverId, status: 'completed' }
        });

        const rideData = ride.toJSON();
        rideData.driver.rating = avgRating || 0;
        rideData.driver.totalRides = totalRides;
        rideData.driver.reviews = reviews;

        res.status(200).json({
            success: true,
            data: rideData
        });
    } catch (error) {
        console.error('Error fetching ride by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch the ride'
        });
    }
};

// @desc    Update ride details (status, seats, price)
// @route   PUT /api/rides/:id
// @access  Private (Driver only)
export const updateRide = async (req, res) => {
    try {
        const { status, availableSeats, pricePerSeat } = req.body;

        const ride = await Ride.findByPk(req.params.id);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // Ensure user is the driver
        if (ride.driverId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this ride' });
        }

        // Update fields if provided
        if (status) ride.status = status;
        if (availableSeats !== undefined) ride.availableSeats = availableSeats;
        if (pricePerSeat !== undefined) ride.pricePerSeat = pricePerSeat;

        await ride.save();

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (error) {
        console.error('Error updating ride:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to update ride'
        });
    }
};

// @desc    Cancel a ride by driver
// @route   PUT /api/rides/:id/cancel
// @access  Private (Driver only)
export const cancelRide = async (req, res) => {
    try {
        const rideId = req.params.id;

        const ride = await Ride.findByPk(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // Ensure user is the driver
        if (ride.driverId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this ride' });
        }

        if (ride.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Ride is already cancelled' });
        }

        // Update ride status
        ride.status = 'cancelled';
        await ride.save();

        // Update all related active bookings to 'cancelled'
        await Booking.update(
            { status: 'cancelled' },
            { where: { rideId: ride.id, status: { [Op.ne]: 'cancelled' } } }
        );

        res.status(200).json({
            success: true,
            message: 'Ride and associated bookings cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling ride:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to cancel ride'
        });
    }
};
