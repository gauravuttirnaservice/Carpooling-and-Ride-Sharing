'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'aadharVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'aadharVerified');
  }
};