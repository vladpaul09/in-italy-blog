"use strict";

const PostScope = [
  "REGION_ONLY",
  "PROVINCE_ONLY",
  "MUNICIPALITY_ONLY",
  "REGION_AND_PROVINCE",
  "REGION_AND_MUNICIPALITIES",
  "PROVINCE_AND_MUNICIPALITIES",
  "REGION_PROVINCES_AND_MUNICIPALITIES",
  "MUNICIPALITIES_SELECTED",
  "ALL_MUNICIPALITIES",
  "EVERYWHERE",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "podcasts",
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
        image: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        mobile_image: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        youtube_link: {
          type: Sequelize.TEXT,
        },
        latitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.DECIMAL(12, 7),
          allowNull: true,
        },
        scope: {
          type: Sequelize.ENUM(...PostScope),
          allowNull: false,
          defaultValue: "EVERYWHERE",
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
    await queryInterface.dropTable("podcasts");
  },
};
