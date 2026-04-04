'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Rides', 'originLat', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Rides', 'originLng', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Rides', 'destLat', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Rides', 'destLng', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rides', 'originLat');
    await queryInterface.removeColumn('Rides', 'originLng');
    await queryInterface.removeColumn('Rides', 'destLat');
    await queryInterface.removeColumn('Rides', 'destLng');
  }
};
