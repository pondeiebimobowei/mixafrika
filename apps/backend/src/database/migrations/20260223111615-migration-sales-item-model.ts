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
      await queryInterface.createTable('sales_item', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        name: { type: Sequelize.STRING, allowNull: false },
        quantity: { type: Sequelize.STRING, allowNull: false },
        type: { type: Sequelize.STRING, allowNull: false },
        unit_price: { type: Sequelize.DECIMAL(15,2), allowNull: false },
        cost_price: { type: Sequelize.DECIMAL(15,2), allowNull: false },
        total: { type: Sequelize.DECIMAL(15,2), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },


        sale_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sales', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'product', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        batch_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'batch', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        
        
        syncStatus: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)]} },
        syncDate: {
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
    await queryInterface.dropTable('sales_item');
  },
};


