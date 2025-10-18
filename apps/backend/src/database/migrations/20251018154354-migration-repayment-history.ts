'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const PaymentStatus = {
    PENDING: "pending",
    SUCCESSFUL: "successful",
    FAILED: "failed",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('repayment_history', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        loan_account_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'loan_account', key: 'id'}, onDelete: "Cascade", onUpdate: "Cascade" },
        status: { type: Sequelize.STRING, validate: { isIn: [Object.values(PaymentStatus)]} },
        
        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('repayment_history');
  },
};
