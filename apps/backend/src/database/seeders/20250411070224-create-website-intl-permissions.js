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
          codename: "admin.i18n.sort",
          resource: "i18n",
          action: "sort",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.i18n.list",
          resource: "i18n",
          action: "list",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.i18n.create",
          resource: "i18n",
          action: "create",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.i18n.edit",
          resource: "i18n",
          action: "edit",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.i18n.delete",
          resource: "i18n",
          action: "delete",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          codename: "admin.i18n.show",
          resource: "i18n",
          action: "show",
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

    await queryInterface.sequelize.query(`delete from permissions where resource="i18n"`);
  },
};
