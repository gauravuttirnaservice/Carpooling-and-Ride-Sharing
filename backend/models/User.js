import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    // Define the user's role in the system
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
    },
    address: {
        type: DataTypes.TEXT,
    },
    aadharVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    driverVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});

export default User;
