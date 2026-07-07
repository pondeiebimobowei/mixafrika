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
      await queryInterface.createTable('cluster', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        collection_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'collection',
            key: 'id',
            
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
          
        },

        name: { type: Sequelize.STRING, allowNull: false },
        
        cover_image: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },

        roi: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        status: {
          type: Sequelize.STRING,
          allowNull: false,

        },

        duration: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isIn: [Object.values(duration)]
          }

        },

        description: { type: Sequelize.STRING, allowNull: false },
        
        about: { 
          type: Sequelize.STRING, 
          allowNull: false 
        },


        target_fundraising_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },


        total_funds_raised: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        start_date: {
          type: Sequelize.STRING,
          allowNull: false
        },

        end_date: {
          type: Sequelize.STRING,
          allowNull: false
        },

        repayment: { type: Sequelize.STRING, allowNull: false },

        sync_status: { 
          type: Sequelize.STRING, 
          allowNull: false, 
          defaultValue: 'pending' 
        },
        
        sync_date: { 
          type: Sequelize.DATE, 
          allowNull: true, 
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
    await queryInterface.dropTable('cluster');
  },
};
