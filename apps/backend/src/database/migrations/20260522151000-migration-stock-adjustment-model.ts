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
      await queryInterface.createTable('stock_adjustment', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        reason: { type: Sequelize.TEXT, allowNull: false },
        
    
        branch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'branch', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
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
    await queryInterface.dropTable('stock_adjustment');
  },
};


