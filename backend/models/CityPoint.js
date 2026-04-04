import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const CityPoint = sequelize.define('CityPoint', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    CityId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    PointName: {
        type: DataTypes.STRING,
        allowNull: false,
    },


}, {
    timestamps: true,
});

export default CityPoint;
