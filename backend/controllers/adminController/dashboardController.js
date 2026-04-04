import { User, Ride, Booking, Review, City, CityPoint } from "../../models/index.js";
import { Op, fn, col } from "sequelize";
import sequelize from "../../config/database.js";
export const getDashboardStats = async (req, res) => {
    const Today = new Date();

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const totalUsers = await User.count();
        const getActiveRides = await Ride.count({
            where: {
                status: ["scheduled", "ongoing"],
                departureTime: {
                    [Op.gte]: Today
                }
            }
        });
        const getCompletedRides = await Ride.count({
            where: {
                status: "completed",
                departureTime: {
                    [Op.lte]: Today
                }
            }
        });
        const totalBookings = await Booking.count({
            where: {
                status: "confirmed",
                createdAt: {
                    [Op.gte]: Today
                }
            }
        });

        const findTotalRevenue = await Booking.sum("totalPrice", {
            where: {
                status: "confirmed",

            }
        })

        const recentUsers = await User.findAll({
            where: {
                role: {
                    [Op.ne]: "admin"   // exclude admin
                }
            },
            order: [["createdAt", "DESC"]],
            limit: 50 // Fetch enough to sort and paginate
        });
        const recentRides = await Ride.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
        const recentBookings = await Booking.findAll({ order: [['createdAt', 'DESC']], limit: 50 });

        let activity = [
            ...recentUsers.map(u => ({ id: `u-${u.id}`, type: 'user', text: `New user joined: ${u.firstName || ''} ${u.lastName || ''}`, time: u.createdAt })),
            ...recentRides.map(r => ({ id: `r-${r.id}`, type: 'ride', text: `New ride created: ${r.origin || 'Unknown'} to ${r.destination || 'Unknown'}`, time: r.createdAt })),
            ...recentBookings.map(b => ({ id: `b-${b.id}`, type: 'booking', text: `New booking made (ID: B-${b.id})`, time: b.createdAt }))
        ];

        activity.sort((a, b) => new Date(b.time) - new Date(a.time));

        const totalActivityCount = activity.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const recentActivity = activity.slice(startIndex, endIndex);

        res.status(200).json({
            totalUsers,
            getActiveRides,
            getCompletedRides,
            findTotalRevenue,
            totalBookings,
            recentActivity,
            totalActivityCount,
            activityPage: page,
            activityTotalPages: Math.ceil(totalActivityCount / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const whereClause = {
            role: { [Op.ne]: "admin" }
        };

        if (search) {
            whereClause[Op.or] = [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { profilePicture: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['passwordHash'] },
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });
        res.status(200).json({ data: users, total: count, page, totalPages: Math.ceil(count / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['passwordHash'] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch total rides created by this user as a driver
        const totalRides = await Ride.count({ where: { driverId: user.id } });

        // Fetch total bookings made by this user as a passenger
        const totalBookings = await Booking.count({ where: { passengerId: user.id } });

        // Calculate average rating
        const reviews = await Review.findAll({ where: { revieweeId: user.id }, attributes: ['rating'] });
        const sumRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        const rating = reviews.length ? (sumRating / reviews.length).toFixed(1) : 0;

        // Fetch latest driver details from their rides
        const driverDetails = await Ride.findOne({
            where: { driverId: user.id },
            attributes: ['carName', 'carNumber', 'drivingLicense', 'aadharCard', 'accountNumber', 'ifscCode', 'driverVerified'],
            order: [['createdAt', 'DESC']]
        });

        // Add to user object
        const userObj = user.toJSON();
        const responseData = {
            ...userObj,
            totalRides,
            totalBookings,
            rating,
            driverDetails: driverDetails || null
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//Verify Aadhar (KYC)
export const verifyAadhar = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.aadharVerified = true;
        await user.save();
        res.status(200).json(user, { message: "Aadhar verified Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllRides = async (req, res) => {
    const { status } = req.query;

    const rides = await Ride.findAll({
        where: status ? { status } : {},
        include: [{ model: User, as: "driver", attributes: ["firstName", "lastName", "email", "profilePicture"] }]
    });

    res.json(rides);
};

export const getAllRideswithDriver = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const status = req.query.status;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const whereClause = status ? { status } : {};

        if (search) {
            whereClause[Op.or] = [
                { origin: { [Op.iLike]: `%${search}%` } },
                { destination: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: rides } = await Ride.findAndCountAll({
            where: whereClause,
            include: [{ model: User, as: "driver", attributes: ["firstName", "lastName", "email", "profilePicture"] }],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        res.json({ data: rides, total: count, page, totalPages: Math.ceil(count / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const forceCancelRide = async (req, res) => {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "cancelled";
    await ride.save();

    res.json({ message: "Ride cancelled by admin" });
};

export const getRidesDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findByPk(id, {
            include: [{ model: User, as: "driver", attributes: ["firstName", "lastName", "email", "profilePicture"] }]
        });

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        // Include other rides by the driver if needed for context
        const otherRides = await Ride.findAll({
            where: { driverId: ride.driverId, id: { [Op.ne]: ride.id } },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.json({ ...ride.toJSON(), otherRides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyDriver = async (req, res) => {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.driverVerified = true;
    await ride.save();

    res.json({ message: "Driver verified successfully" });
};

export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const status = req.query.status;
        // Search isn't trivially added here without joining manually, but let's do simple status filter with pagination
        const offset = (page - 1) * limit;

        const whereClause = status ? { status } : {};

        const { count, rows: bookings } = await Booking.findAndCountAll({
            where: whereClause,
            include: [
                { model: Ride, as: "ride" },
                { model: User, as: "passenger", attributes: ["firstName", "lastName", "email"] }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        res.json({ data: bookings, total: count, page, totalPages: Math.ceil(count / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createCityWithPoints = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { CityName, Points } = req.body;

        // 1️⃣ Validate
        if (!CityName || !Points || !Array.isArray(Points) || Points.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "CityName and at least one point are required"
            });
        }

        // 2️⃣ Check city exists
        const existingCity = await City.findOne({
            where: {
                CityName: {
                    [Op.iLike]: CityName.trim()
                }
            }
        });

        if (existingCity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "City already exists"
            });
        }

        // 3️⃣ Create City
        const city = await City.create(
            { CityName: CityName.trim() },
            { transaction }
        );

        // 4️⃣ Prepare points
        const pointsData = Points.map(point => ({
            CityId: city.id,
            PointName: point.trim()
        }));

        // 5️⃣ Bulk create points
        await CityPoint.bulkCreate(pointsData, { transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: "City and points created successfully",
            data: city
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error creating city with points:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const deleteCity = async (req, res) => {
    await City.destroy({ where: { id: req.params.id } });
    res.json({ message: "City deleted" });
};

export const getAllCities = async (req, res) => {
    try {
        const cities = await City.findAll({
            include: [
                {
                    model: CityPoint,
                    as: "points",
                    attributes: ["id", "PointName"]
                }
            ],
            order: [
                ["CityName", "ASC"],
                [{ model: CityPoint, as: "points" }, "PointName", "ASC"]
            ]
        });

        res.status(200).json({
            success: true,
            count: cities.length,
            data: cities
        });

    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await Review.findAndCountAll({
            include: [
                { model: Ride, as: "ride", attributes: ["id", "origin", "destination"] },
                { model: User, as: "reviewer", attributes: ["firstName", "lastName", "profilePicture"] },
                { model: User, as: "reviewee", attributes: ["firstName", "lastName"] }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });
        res.json({ data: reviews, total: count, page, totalPages: Math.ceil(count / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Moderate Reviews (Hide/Unhide)
export const moderateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Toggle the visibility
        review.isHidden = !review.isHidden;
        await review.save();

        res.status(200).json(review, { message: `Review ${review.isHidden ? 'hidden' : 'unhidden'} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};