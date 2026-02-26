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

export const Status = {
    ACTIVE: "active",
    DEFAULTED: "defaulted",
    FAILED: "failed",
    PENDING: "pending",
    COMPLETED: "completed",
} as const;

export const RepaymentStatus = {
    PAID: "paid",
    "PAID (LATE)": "paid (late)",
    MISSED: "missed",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('transaction', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'user', key: 'id' },
          onDelete: 'Cascade',
          onUpdate: 'Cascade',
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: { isIn: [Object.values(Types)] },
        },
        title: { type: Sequelize.STRING, allowNull: false },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isIn: [[...Object.values(Status), ...Object.values(RepaymentStatus)]]
          }
        },
        category: { type: Sequelize.STRING, allowNull: false },
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
    await queryInterface.dropTable('transaction');
  },
};
