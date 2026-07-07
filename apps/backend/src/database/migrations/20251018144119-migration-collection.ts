'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

export const duration = {
    THIRITY: 30,
    SIXTY: 60,
    NINETY: 90,

} as const;

export type Duration = (typeof duration)[keyof typeof duration];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('collection', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        
        name: { type: Sequelize.STRING, allowNull: false },
        
        description: { type: Sequelize.STRING, allowNull: false },
        
        total_traders: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        
        about: { 
          type: Sequelize.STRING, 
          allowNull: false 
        },

        cover_image: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },

        roi: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        min_investment: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },

        city: {
          type: Sequelize.STRING,
          allowNull: false,

        },

        state: {
          type: Sequelize.STRING,
          allowNull: false,

        },

        country: {
          type: Sequelize.STRING,
          allowNull: false,

        },

        sync_status: { 
          type: Sequelize.STRING, 
          allowNull: false, 
          defaultValue: 'pending' 
        },
        
        sync_date: { 
          type: Sequelize.DATE, 
          allowNull: true 
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
    await queryInterface.dropTable('collection');
  },
};
