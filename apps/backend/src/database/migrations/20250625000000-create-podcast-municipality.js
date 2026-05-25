'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('podcasts_municipalities', {
      podcast_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "podcasts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      municipality_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: "municipalities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
    await queryInterface.addConstraint("podcasts_municipalities", { fields: ["podcast_id", "municipality_id"], type: "PRIMARY KEY" });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('podcasts_municipalities');
  }
}; 