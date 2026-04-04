import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rideId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reviewerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    revieweeId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: {
        type: DataTypes.TEXT,
    },
    isHidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});

export default Review;
