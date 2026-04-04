'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Rides', 'driverVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rides', 'driverVerified');
  }
};
