'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const syncStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
} as const;

export const roles = {
    TRADER: "trader",
    INVESTOR: "investor",
    AGENT: "agent",
    ADMIN: "admin",
    SUBADMIN: "subadmin"
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('business_user', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        role: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(roles)]} },
        is_active: { type: Sequelize.BOOLEAN, allowNull: false },
        has_full_access: { type: Sequelize.BOOLEAN, allowNull: false },
        joined_at: { type: Sequelize.DATE, allowNull: true },
        
        

        business_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user_business', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        user_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        
        
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
    await queryInterface.dropTable('business_user');
  },
};


