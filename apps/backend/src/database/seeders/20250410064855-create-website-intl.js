'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
      "i18n",
      [
        {
          id: "accommodationSectionTitle",
          lang_id: "it",
          value: "La città ti accoglie",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "accommodationSectionTitle",
          lang_id: "en",
          value: "The city welcomes you",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "articleSectionTitle",
          lang_id: "it",
          value: "Tutte le attività",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "articleSectionTitle",
          lang_id: "en",
          value: "All activities",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityA",
          lang_id: "it",
          value: "Accade in",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityA",
          lang_id: "en",
          value: "Happens in",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityB",
          lang_id: "it",
          value: "città",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityB",
          lang_id: "en",
          value: "the city",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityC",
          lang_id: "it",
          value: "provincia",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "happensInCityC",
          lang_id: "en",
          value: "province",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "inspireButton",
          lang_id: "it",
          value: "Lasciati Ispirate",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "inspireButton",
          lang_id: "en",
          value: "Get Inspired",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "newsletterTitle",
          lang_id: "it",
          value: "vuoi ricevere info sugli eventi della città?",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "newsletterTitle",
          lang_id: "en",
          value: "do you want to receive information on events in the city?",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "regionalDescTitle",
          lang_id: "it",
          value: "e dintorni",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "regionalDescTitle",
          lang_id: "en",
          value: "and surroundings",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "registerButton",
          lang_id: "it",
          value: "Registrati",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "registerButton",
          lang_id: "en",
          value: "Register",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantDolci",
          lang_id: "it",
          value: "Dolci, cioccolata e prodotti al forno",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantDolci",
          lang_id: "en",
          value: "Sweets, chocolate and baked goods",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantFormaggi",
          lang_id: "it",
          value: "Formaggi, carne e pesce",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantFormaggi",
          lang_id: "en",
          value: "Cheese, meat and fish",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantOlio",
          lang_id: "it",
          value: "Olio, aceto e spezie",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantOlio",
          lang_id: "en",
          value: "Oil, vinegar and spices",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantPasta",
          lang_id: "it",
          value: "Pasta e cereali",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantPasta",
          lang_id: "en",
          value: "Pasta and cereals",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantSalse",
          lang_id: "it",
          value: "Salse, sughi e conserve",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantSalse",
          lang_id: "en",
          value: "Sauces, gravies and preserves",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: 'restaurantVino',
          lang_id: 'it',
          value: 'Vino, liquori e birra',
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: 'restaurantVino',
          lang_id: 'en',
          value: 'Wine, liquors and beer',
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantSectionTitle",
          lang_id: "it",
          value: "Tutto il Sapore di napoli a casa tua",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "restaurantSectionTitle",
          lang_id: "en",
          value: "All the Flavor of Naples at home",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "menuSeeAll",
          lang_id: "it",
          value: "Vedi tutto",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        },
        {
          id: "menuSeeAll",
          lang_id: "en",
          value: "See all",
          createdAt: "2025-01-17 10:51:16",
          updatedAt: "2025-01-17 10:51:16",
        }
      ]
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.sequelize.query(`delete from i18n where 1=1 `);
  }
};
