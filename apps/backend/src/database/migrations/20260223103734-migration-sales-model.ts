'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const syncStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

const salesStatus = {
  PENDING: "pending",
  VERIFIED: "verified",
  UNVERIFIED: 'unverified',
  REJECTED: "rejected",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('sales', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        total_amount: { type: Sequelize.BIGINT, allowNull: false },
        amount_paid: { type: Sequelize.BIGINT, allowNull: false },
        balance: { type: Sequelize.BIGINT, allowNull: false },
        payment_method: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(salesStatus)] } },
        note: { type: Sequelize.STRING, allowNull: true },


        branch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'business', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },
        customer_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'user', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },
        created_by_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'user', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },


        sync_status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } },
        sync_date: {
          allowNull: true,
          type: Sequelize.DATE,
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
    await queryInterface.dropTable('sales');
  },
};


