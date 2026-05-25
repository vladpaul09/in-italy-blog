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
      "regions",
      [
        { id: "01", slug: "piemonte", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "02", slug: "valle-d-aosta", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "03", slug: "lombardia", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "04", slug: "trentino-alto-adige", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "05", slug: "veneto", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        {
          id: "06",
          slug: "friuli-venezia-giulia",
          image: "",
          show_frontend: true,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        { id: "07", slug: "liguria", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "08", slug: "emilia-romagna", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "09", slug: "toscana", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "10", slug: "umbria", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "11", slug: "marche", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "12", slug: "lazio", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "13", slug: "abruzzo", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "14", slug: "molise", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "15", slug: "campania", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "16", slug: "puglia", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "17", slug: "basilicata", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "18", slug: "calabria", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "19", slug: "sicilia", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { id: "20", slug: "sardegna", image: "", show_frontend: true, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
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
    await queryInterface.sequelize.query(`delete from regions where 1=1`);
  },
};
