'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('saving', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        total_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        maturity_date: { type: Sequelize.DATE, allowNull: false },
        auto_save: { type: Sequelize.BOOLEAN, allowNull: false },
        daily_auto_save: { type: Sequelize.BOOLEAN, allowNull: false },
        source: { type: Sequelize.STRING, allowNull: false },
        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('saving');
  },
};
