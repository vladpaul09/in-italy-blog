"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING(100),
      },
      last_name: {
        type: Sequelize.DataTypes.STRING(100),
      },
      email: {
        type: Sequelize.DataTypes.STRING(255),
        unique: true
      },
      password: {
        type: Sequelize.DataTypes.STRING(100),
      },
      is_super_user: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
