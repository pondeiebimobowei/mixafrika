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
      await queryInterface.createTable('product', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        name: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.STRING, allowNull: false },
        bulk_unit_name: { type: Sequelize.STRING, allowNull: false },
        piece_unit_name: { type: Sequelize.STRING, allowNull: false },
        units_per_bulk: { type: Sequelize.BIGINT, allowNull: false },
        selling_price_per_piece: { type: Sequelize.BIGINT, allowNull: false },
        selling_price_per_bulk: { type: Sequelize.BIGINT, allowNull: false },
        category: { type: Sequelize.STRING, allowNull: false },
        image_url: { type: Sequelize.STRING, allowNull: false },
        reviews: { type: Sequelize.STRING, allowNull: false },
        

        branch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'branch', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        global_product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'global_product', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        
        
        sync_status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)]} },
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
    await queryInterface.dropTable('product');
  },
};