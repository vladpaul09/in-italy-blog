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
          codename: "admin.business-registration-form.list",
          resource: "business-registration-form",
          action: "list",
          createdAt: "2025-07-08 00:00:03",
          updatedAt: "2025-07-08 00:00:03",
        },
        {
          codename: "admin.business-registration-form.show",
          resource: "business-registration-form",
          action: "show",
          createdAt: "2025-07-08 00:00:03",
          updatedAt: "2025-07-08 00:00:03",
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

    await queryInterface.sequelize.query(`delete from permissions where resource="business-registration-form"`);
  },
}; 