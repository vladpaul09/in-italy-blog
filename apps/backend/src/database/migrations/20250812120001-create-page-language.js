"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "pages_languages",
      {
        page_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "pages",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        language_id: {
          type: Sequelize.STRING(10),
          allowNull: false,
          references: {
            model: "languages",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        meta_title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        meta_description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        page_title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        page_description: {
          type: Sequelize.TEXT,
          allowNull: false,
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

    await queryInterface.addConstraint("pages_languages", { fields: ["page_id", "language_id"], type: "PRIMARY KEY" });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pages_languages");
  },
};
