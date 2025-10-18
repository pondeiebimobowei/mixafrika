'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const Types = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  LOAN: 'loan',
  REPAYMENT: 'repayment',
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('saving_history', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        savings_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'saving', key: 'id' },
          onDelete: 'Cascade',
          onUpdate: 'Cascade',
        },
        type: {
          type: Sequelize.STRING,
          validate: { isIn: [Object.values(Types)] },
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('saving_history');
  },
};
