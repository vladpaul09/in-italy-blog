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
          codename: "admin.users.list",
          resource: "users",
          action: "list",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.users.show",
          resource: "users",
          action: 'show',
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.users.create",
          resource: "users",
          action: "create",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.users.edit",
          resource: "users",
          action: "edit",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.users.delete",
          resource: "users",
          action: "delete",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
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
    await queryInterface.sequelize.query(`delete from permissions where resource="users"`);
  },
};
