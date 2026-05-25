"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // lookup table for preferred travel periods
    await queryInterface.createTable(
      "preferred_travel_periods",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        value: {
          type: Sequelize.ENUM("spring", "summer", "autumn", "winter"),
          allowNull: false,
          unique: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );

    // seed lookup values
    await queryInterface.bulkInsert("preferred_travel_periods", [
      { value: "spring", createdAt: new Date(), updatedAt: new Date() },
      { value: "summer", createdAt: new Date(), updatedAt: new Date() },
      { value: "autumn", createdAt: new Date(), updatedAt: new Date() },
      { value: "winter", createdAt: new Date(), updatedAt: new Date() },
    ]);

    await queryInterface.createTable(
      "member_preferred_travel_periods",
      {
        member_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "members",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        preferred_travel_period_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "preferred_travel_periods",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );

    await queryInterface.addConstraint("member_preferred_travel_periods", {
      fields: ["member_id", "preferred_travel_period_id"],
      type: "primary key",
      name: "pk_member_pref_tp"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("preferred_travel_periods");

    await queryInterface.dropTable("member_preferred_travel_periods");

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_member_preferred_travel_periods_preferred_travel_period";`
    );
  },
};