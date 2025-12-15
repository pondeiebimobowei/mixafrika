'use strict';

import { DataTypes } from "sequelize";

export const cardType = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    VERVE: "verve",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('bank_card', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'user', key: 'id' },
          onDelete: 'Cascade',
          onUpdate: 'Cascade',
        },
        payment_token: { type: Sequelize.STRING, allowNull: false },
        last_four_digits: { type: Sequelize.STRING, allowNull: false },
        card_type: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(cardType)] }  },
        is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('bank_card', { transaction: t });
    });
  }
};
