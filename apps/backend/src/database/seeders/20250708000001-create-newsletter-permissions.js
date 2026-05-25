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
          codename: "admin.newsletter.list",
          resource: "newsletter",
          action: "list",
          createdAt: "2025-07-08 00:00:01",
          updatedAt: "2025-07-08 00:00:01",
        },
        {
          codename: "admin.newsletter.show",
          resource: "newsletter",
          action: "show",
          createdAt: "2025-07-08 00:00:01",
          updatedAt: "2025-07-08 00:00:01",
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

    await queryInterface.sequelize.query(`delete from permissions where resource="newsletter"`);
  },
}; 