"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "members",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        },
        // Base Data (Mandatory)
        first_name: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },
        last_name: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },
        country: {
          type: Sequelize.DataTypes.ENUM("italy", "foreign"),
          allowNull: false,
        },
        region_id: {
          type: Sequelize.STRING(2),
          allowNull: true,
          references: {
            model: "regions",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        municipality_id: {
          type: Sequelize.STRING(10),
          allowNull: true,
          references: {
            model: "municipalities",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        phone: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: true,
        },
        // Personal Profile
        gender: {
          type: Sequelize.DataTypes.ENUM("male", "female", "prefer_not_to_say"),
          allowNull: true,
        },
        age_range: {
          type: Sequelize.DataTypes.ENUM("18_25", "26_35", "36_45", "46_60", "over_60"),
          allowNull: true,
        },
        family_situation: {
          type: Sequelize.DataTypes.ENUM(
            "single",
            "couple",
            "couple_with_young_children",
            "couple_with_teenagers",
            "family_with_adult_children",
            "retired_or_senior_traveler"
          ),
          allowNull: true,
        },
        travel_companion: {
          type: Sequelize.DataTypes.ENUM("alone", "travel_couple", "with_friends", "family", "organized_group"),
          allowNull: true,
        },
        // Travel Habits
        travel_frequency: {
          type: Sequelize.DataTypes.ENUM("once_per_year", "two_three_times_per_year", "more_than_three_times_per_year"),
          allowNull: true,
        },
        average_stay_duration: {
          type: Sequelize.DataTypes.ENUM("weekend", "one_week", "more_than_one_week"),
          allowNull: true,
        },
        preferred_travel_period: {
          type: Sequelize.DataTypes.ENUM("spring", "summer", "autumn", "winter"),
          allowNull: true,
        },
        average_budget: {
          type: Sequelize.DataTypes.ENUM("less_than_300", "from_300_to_800", "from_800_to_1500", "more_than_1500"),
          allowNull: true,
        },
        // Consent and Privacy
        personalized_content_consent: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        newsletter_consent: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        // Active status
        is_active: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
        },
        // Email confirmation
        email_confirmation_token: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
        },
        // Password reset
        password_reset_token: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
        },
        password_reset_token_expires_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );

    // Add indexes for better query performance
    await queryInterface.addIndex("members", ["email"]);
    await queryInterface.addIndex("members", ["region_id"]);
    await queryInterface.addIndex("members", ["municipality_id"]);
    await queryInterface.addIndex("members", ["email_confirmation_token"]);
    await queryInterface.addIndex("members", ["password_reset_token"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("members");
  },
};
