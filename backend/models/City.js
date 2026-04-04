import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const City = sequelize.define('City', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    CityName: {
        type: DataTypes.STRING,
        allowNull: false,
    },



}, {
    timestamps: true,
});

export default City;
