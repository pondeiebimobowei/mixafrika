'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const syncStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('batch', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        expiry_date: { type: Sequelize.STRING, allowNull: false },
        batch_number: { type: Sequelize.STRING, allowNull: false },
        cost_price_per_unit: { type: Sequelize.BIGINT, allowNull: false },
        selling_price_per_piece: { type: Sequelize.BIGINT, allowNull: false },
        selling_price_per_bulk: { type: Sequelize.BIGINT, allowNull: false },
        initial_quantity: { type: Sequelize.BIGINT, allowNull: false },
        remaining_quantity: { type: Sequelize.BIGINT, allowNull: false },


        product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'product', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },
        branch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'branch', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },


        sync_status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } },
        sync_date: {
          allowNull: false,
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
    await queryInterface.dropTable('batch');
  },
};


