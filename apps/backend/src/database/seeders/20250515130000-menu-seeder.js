'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert menu items (converting the original menu slugs to menu items)
    const menuItems = [
      { id: 1, parent_id: null, slug: 'destinations', url: '/destinations', type: 'link', is_visible: true, position: 0 },
      { id: 2, parent_id: null, slug: 'art-culture', url: '/art-culture', type: 'link', is_visible: true, position: 1 },
      { id: 3, parent_id: null, slug: 'events', url: '/events', type: 'events', is_visible: true, position: 2 },
      { id: 4, parent_id: null, slug: 'magazine', url: '/magazine', type: 'articles', is_visible: true, position: 3 },
    ];

    await queryInterface.bulkInsert('menu_items', menuItems.map(mi => ({
      ...mi,
      created_at: new Date(),
      updated_at: new Date(),
    })), {});

    // Insert menu item languages
    const menuItemLanguages = [
      { menu_item_id: 1, language_id: 'en', title: 'Destinations' },
      { menu_item_id: 1, language_id: 'it', title: 'Destinazioni' },
      { menu_item_id: 2, language_id: 'en', title: 'Art & Culture' },
      { menu_item_id: 2, language_id: 'it', title: 'Arte e Cultura' },
      { menu_item_id: 3, language_id: 'en', title: 'Events' },
      { menu_item_id: 3, language_id: 'it', title: 'Eventi' },
      { menu_item_id: 4, language_id: 'en', title: 'Magazine' },
      { menu_item_id: 4, language_id: 'it', title: 'Rivista' },
    ];

    await queryInterface.bulkInsert('menu_item_languages', menuItemLanguages.map(mil => ({
      ...mil,
      created_at: new Date(),
      updated_at: new Date(),
    })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('menu_item_languages', {
      menu_item_id: { [Sequelize.Op.in]: [1, 2, 3, 4] }
    }, {});
    await queryInterface.bulkDelete('menu_items', {
      id: { [Sequelize.Op.in]: [1, 2, 3, 4] }
    }, {});
  }
}; 