import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ride = sequelize.define('Ride', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    driverId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    pricePerSeat: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
    },
    aadharCard: {
        type: DataTypes.STRING,
    },
    drivingLicense: {
        type: DataTypes.STRING,
    },
    carName: {
        type: DataTypes.STRING,
    },
    carNumber: {
        type: DataTypes.STRING,
    },
    accountNumber: {
        type: DataTypes.STRING,
    },
    ifscCode: {
        type: DataTypes.STRING,
    },
    driverVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    originLat: {
        type: DataTypes.FLOAT,
    },
    originLng: {
        type: DataTypes.FLOAT,
    },
    destLat: {
        type: DataTypes.FLOAT,
    },
    destLng: {
        type: DataTypes.FLOAT,
    }
}, {
    timestamps: true,
});

export default Ride;
