"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("languages", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(10),
      },
      name: {
        type: Sequelize.STRING(50),
      },
      default: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      image: {
        type: Sequelize.STRING(255),
      },
      sort_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("languages");
  },
};
