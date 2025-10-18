'use strict';
import { Roles } from '@shared/shared/src/enums';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('loan_account', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id' }, onDelete: "Cascade", onUpdate: "Cascade"  },
        received_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        repaid_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        repayment_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        interest_rate: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        duration: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('loan_account');
  },
};
