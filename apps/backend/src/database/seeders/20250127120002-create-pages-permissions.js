"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          codename: "admin.pages.list",
          resource: "pages",
          action: "list",
          createdAt: "2025-01-27 12:00:16",
          updatedAt: "2025-01-27 12:00:16",
        },
        {
          codename: "admin.pages.show",
          resource: "pages",
          action: "show",
          createdAt: "2025-01-27 12:00:16",
          updatedAt: "2025-01-27 12:00:16",
        },
        {
          codename: "admin.pages.create",
          resource: "pages",
          action: "create",
          createdAt: "2025-01-27 12:00:16",
          updatedAt: "2025-01-27 12:00:16",
        },
        {
          codename: "admin.pages.edit",
          resource: "pages",
          action: "edit",
          createdAt: "2025-01-27 12:00:16",
          updatedAt: "2025-01-27 12:00:16",
        },
        {
          codename: "admin.pages.delete",
          resource: "pages",
          action: "delete",
          createdAt: "2025-01-27 12:00:16",
          updatedAt: "2025-01-27 12:00:16",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.sequelize.query(`delete from permissions where resource="pages"`);
  },
};
