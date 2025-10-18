'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('user_business', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        user_id: { type: Sequelize.UUID, allowNull: false },
        name: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        address: { type: Sequelize.STRING, allowNull: false },
        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('user_business');
  },
};
