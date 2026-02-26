'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

export const savingsType = {
    TARGET: 'target',
    LOCKED: 'locked',
    GROUP: 'group',
    MIX: 'mix',
}

export type SavingsType = (typeof savingsType)[keyof typeof savingsType];

export const savingsFrequency = {
    MANUAL: 'manual',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
} as const;

export type SavingsFrequency = (typeof savingsFrequency)[keyof typeof savingsFrequency];

export const sourceType = {
  BANK: 'bank',
  WALLET: 'wallet',
  CARD: 'card'
} as const;

export type SourceType = (typeof sourceType)[keyof typeof sourceType];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('saving', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        total_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        target_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        interest_rate: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        frequency: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: { 
            isIn: [Object.values(savingsFrequency)]
          }
        },

        maturity_date: { type: Sequelize.DATE, allowNull: true },
        auto_save: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
        is_locked: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
        source_id: { type: Sequelize.UUID, allowNull: false },
        source_type: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(sourceType)]} },
        name: { type: Sequelize.STRING, allowNull: false },
        type: { type: Sequelize.STRING, validate: { isIn: [Object.values(savingsType)]}, allowNull: false },

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
      });
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('saving');
  },
};
