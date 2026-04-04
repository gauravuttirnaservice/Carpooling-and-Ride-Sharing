'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      CityName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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

  async down(queryInterface) {
    await queryInterface.dropTable('Cities');
  }
};