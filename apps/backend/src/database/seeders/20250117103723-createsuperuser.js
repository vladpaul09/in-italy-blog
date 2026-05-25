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
      "users",
      [
        {
          id: 1,
          first_name: "Super",
          last_name: "Admin",
          is_super_user: true,
          email: "info@ndbwebservice.com",
          password: "$2a$10$NAV6GwvB1RShcJamvieqQO4oL5.pW5QxiqHVNBDr3J/VSsRoUuI8u",
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
    await queryInterface.sequelize.query(`delete from users where email="info@ndbwebservice.com"`);
  },
};
