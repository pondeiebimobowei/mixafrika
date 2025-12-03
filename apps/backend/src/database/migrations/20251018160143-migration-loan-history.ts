'use strict';

import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const LoanStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REPAID: 'repaid',
  COMPLETED: 'completed'
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('loan_history', {
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

        cluster_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'cluster', key: 'id' },
          onDelete: 'Cascade',
          onUpdate: 'Cascade',
        },
        
        status: {
          type: Sequelize.STRING,
          validate: { isIn: [Object.values(LoanStatus)] },
          defaultValue: 'user',
        },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

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
    await queryInterface.dropTable('loan_history');
  },
};
