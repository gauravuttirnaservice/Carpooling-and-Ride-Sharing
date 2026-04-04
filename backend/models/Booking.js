import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rideId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    passengerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    seatsBooked: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1,
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending',
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
    },
}, {
    timestamps: true,
});

export default Booking;
