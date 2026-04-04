'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('Bookings', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('Bookings', 'paymentStatus');

    // ⚠️ Important for PostgreSQL:
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Bookings_paymentStatus";'
    );

  }
};