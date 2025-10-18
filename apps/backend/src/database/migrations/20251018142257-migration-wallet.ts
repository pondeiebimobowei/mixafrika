'use strict';

import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('wallet', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        total_portfolio: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },

        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('wallet');
  },
};
