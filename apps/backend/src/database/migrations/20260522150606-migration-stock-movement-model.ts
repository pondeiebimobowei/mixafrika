'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const syncStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
} as const;

const transferStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    FAILED: "failed",
} as const;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('stock_movement', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        type: { type: Sequelize.STRING, allowNull: false },
        quantity: { type: Sequelize.DECIMAL(15,2), allowNull: false },
        reference_id: { type: Sequelize.STRING, allowNull: false },
        notes: { type: Sequelize.TEXT, allowNull: false },
        
    
        product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'product', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        branch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'branch', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        batch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'batch', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        

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
    await queryInterface.dropTable('stock_movement');
  },
};


