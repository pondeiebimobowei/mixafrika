'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const Status = {
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('investment', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        cluster_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'cluster', key: 'id' }, onDelete: "Cascade", onUpdate: "Cascade" },
        amount_invested: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        current_value: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        cycle_progress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        cycle_ends: { allowNull: false, type: Sequelize.DATE },
        status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(Status)]} },

        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('investment');
  },
};
