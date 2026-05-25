"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "push_subscriptions",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED,
        },
        endpoint: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        p256dh_key: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        auth_key: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        locale: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "it",
          references: {
            model: "languages",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        latitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        expiration_time: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        user_agent: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("push_subscriptions");
  },
};
