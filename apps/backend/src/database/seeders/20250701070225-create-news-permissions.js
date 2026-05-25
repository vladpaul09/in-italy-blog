"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          codename: "admin.news.review",
          resource: "news",
          action: "review",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.own",
          resource: "news",
          action: "own",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.publish",
          resource: "news",
          action: "publish",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.sort",
          resource: "news",
          action: "sort",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.list",
          resource: "news",
          action: "list",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.show",
          resource: "news",
          action: "show",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.create",
          resource: "news",
          action: "create",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.edit",
          resource: "news",
          action: "edit",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.delete",
          resource: "news",
          action: "delete",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.news.field.author",
          resource: "news",
          action: "field.author",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`delete from permissions where resource="news"`);
  },
};
