"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "events",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED,
        },
        slug: {
          type: Sequelize.STRING(100),
          unique: true,
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        },
        user_review_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        },
        municipality_id: {
          type: Sequelize.STRING(10),
          allowNull: false,
          references: {
            model: "municipalities",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        image: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        mobile_image: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        region_level: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        province_level: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        latitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        publish: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        author_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        author_alias_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: "users_aliases",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
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
    await queryInterface.dropTable("events");
  },
};
