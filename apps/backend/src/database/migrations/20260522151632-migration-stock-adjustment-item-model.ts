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
      await queryInterface.createTable('stock_adjustment_item', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        quantity: { type: Sequelize.BIGINT, allowNull: false },


        adjustment_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'stock_adjustment', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },
        product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'product', key: 'id' }, onDelete: 'Cascade', onUpdate: 'cascade' },


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
    await queryInterface.dropTable('stock_adjustment_item');
  },
};


