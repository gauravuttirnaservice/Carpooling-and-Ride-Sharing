'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CityPoints', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      CityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id'
        },
        onDelete: 'CASCADE',
        unique: 'unique_city_point'
      },
      PointName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'unique_city_point'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CityPoints');
  }
};