import sequelize from '../config/database.js';
import User from './User.js';
import Ride from './Ride.js';
import Booking from './Booking.js';
import Review from './Review.js';
import City from './City.js';
import CityPoint from './CityPoint.js';


// Define Associations

// 1. User and Ride (Driver)
User.hasMany(Ride, { foreignKey: 'driverId', as: 'drivenRides' });
Ride.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// 2. User and Booking (Passenger)
User.hasMany(Booking, { foreignKey: 'passengerId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'passengerId', as: 'passenger' });

// 3. Ride and Booking
Ride.hasMany(Booking, { foreignKey: 'rideId', as: 'bookings' });
Booking.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });


// One City has many Points
City.hasMany(CityPoint, {
    foreignKey: "CityId",
    as: "points",
    onDelete: "CASCADE"
});

// Each Point belongs to one City
CityPoint.belongsTo(City, {
    foreignKey: "CityId",
    as: "city"
});

// 4. User and Review (Reviewer & Reviewee)
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviewsGiven' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

User.hasMany(Review, { foreignKey: 'revieweeId', as: 'reviewsReceived' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

// City.hasMany(CityPoint, { foreignKey: 'cityId', as: 'cityPoints' });
// CityPoint.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// 5. Ride and Review
Ride.hasMany(Review, { foreignKey: 'rideId', as: 'reviews' });
Review.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

export {
    sequelize,
    User,
    Ride,
    Booking,
    Review,
    City,
    CityPoint
};
