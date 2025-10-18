'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('feed', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id' }, onDelete: "Cascade", onUpdate: "Cascade"  },
        content: { type: Sequelize.STRING, allowNull: false },
        likes: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        comments: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        shares: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        views: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('feed');
  },
};
