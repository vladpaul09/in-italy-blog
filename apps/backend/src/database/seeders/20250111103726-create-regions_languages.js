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
      "regions_languages",
      [
        { region_id: "01", language_id: "it", name: "Piemonte", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        {
          region_id: "02",
          language_id: "it",
          name: "Valle d'Aosta",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          region_id: "03",
          language_id: "it",
          name: "Lombardia",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          region_id: "04",
          language_id: "it",
          name: "Trentino-Alto Adige",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        { region_id: "05", language_id: "it", name: "Veneto", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        {
          region_id: "06",
          language_id: "it",
          name: "Friuli-Venezia Giulia",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        { region_id: "07", language_id: "it", name: "Liguria", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        {
          region_id: "08",
          language_id: "it",
          name: "Emilia-Romagna",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        { region_id: "09", language_id: "it", name: "Toscana", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "10", language_id: "it", name: "Umbria", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "11", language_id: "it", name: "Marche", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "12", language_id: "it", name: "Lazio", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "13", language_id: "it", name: "Abruzzo", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "14", language_id: "it", name: "Molise", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "15", language_id: "it", name: "Campania", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "16", language_id: "it", name: "Puglia", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        {
          region_id: "17",
          language_id: "it",
          name: "Basilicata",
          description: null,
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        { region_id: "18", language_id: "it", name: "Calabria", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "19", language_id: "it", name: "Sicilia", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
        { region_id: "20", language_id: "it", name: "Sardegna", description: null, createdAt: "2025-01-17 10:51:16", updatedAt: "2025-01-17 10:51:16" },
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
    await queryInterface.sequelize.query(`delete from regions_languages where 1=1`);
  },
};
