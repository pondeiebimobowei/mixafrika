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
      await queryInterface.createTable('branch', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        name: { type: Sequelize.STRING, allowNull: false },
        is_head_office: { type: Sequelize.BOOLEAN, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        street_address: { type: Sequelize.STRING, allowNull: false },
        city: { type: Sequelize.STRING, allowNull: false },
        state: { type: Sequelize.STRING, allowNull: false },
        country: { type: Sequelize.STRING, allowNull: false },
        

        business_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'business',
            key: 'id',
            
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
          
        },
        collection_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'collection',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
          
        },
        

        sync_status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)]} },
        sync_date: { allowNull: true, type: Sequelize.DATE },


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
    await queryInterface.dropTable('branch');
  },
};


