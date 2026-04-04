'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reviews', 'isHidden', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reviews', 'isHidden');
  }
};
