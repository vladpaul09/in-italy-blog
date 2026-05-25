"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("regions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(2),
      },
      slug: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mobile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      show_frontend: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("regions");
  },
};
