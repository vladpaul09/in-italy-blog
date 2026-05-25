"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
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
      parent_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      type: {
        type: Sequelize.ENUM("categories-articles", "categories-events", "categories-podcasts"),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mobile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_fixed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      page_view: {
        allowNull: false,
        type: Sequelize.ENUM("POSTS_VIEW", "REGIONAL_VIEW", "PARENT_CATEGORY_VIEW"),
        defaultValue: "POSTS_VIEW",
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
    await queryInterface.dropTable("categories");
  },
};