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
          codename: "admin.tags.list",
          resource: "tags",
          action: "list",
          createdAt: "2025-10-10 12:00:00",
          updatedAt: "2025-10-10 12:00:00",
        },
        {
          codename: "admin.tags.show",
          resource: "tags",
          action: "show",
          createdAt: "2025-10-10 12:00:00",
          updatedAt: "2025-10-10 12:00:00",
        },
        {
          codename: "admin.tags.create",
          resource: "tags",
          action: "add",
          createdAt: "2025-10-10 12:00:00",
          updatedAt: "2025-10-10 12:00:00",
        },
        {
          codename: "admin.tags.edit",
          resource: "tags",
          action: "edit",
          createdAt: "2025-10-10 12:00:00",
          updatedAt: "2025-10-10 12:00:00",
        },
        {
          codename: "admin.tags.delete",
          resource: "tags",
          action: "delete",
          createdAt: "2025-10-10 12:00:00",
          updatedAt: "2025-10-10 12:00:00",
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
    await queryInterface.sequelize.query(`delete from permissions where resource="tags"`);
  },
};
