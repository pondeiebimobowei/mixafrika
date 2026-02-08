'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

export const LoanStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REPAID: "repaid",
    COMPLETED: 'completed'
} as const;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('loan_account', {
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

        transaction_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'transaction', key: 'id' },
          onDelete: 'Cascade',
          onUpdate: 'Cascade',
        },

        application_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'funding_application',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        cluster_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'cluster',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        
        disbursed_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        status: {
          type: Sequelize.STRING,
          validate: { isIn: [Object.values(LoanStatus)] },
          defaultValue: 'pending',
        },
        
        repaid_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        daily_repayment_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        total_repayment_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        approved_at: {
          allowNull: false,
          type: Sequelize.DATE
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
    await queryInterface.dropTable('loan_account');
  },
};
