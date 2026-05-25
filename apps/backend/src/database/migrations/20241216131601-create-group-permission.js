'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups_permissions', {
      group_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permission_codename: {
        type: Sequelize.STRING(100),
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'codename',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.addConstraint("groups_permissions", { fields: ["group_id", "permission_codename"], type: "PRIMARY KEY" });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('groups_permissions');
  }
};