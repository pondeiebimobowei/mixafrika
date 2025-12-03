'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction( async(t) =>{
      await queryInterface.createTable('funding_application', {
        id: { type: Sequelize.UUID, defaultValue: sequelize.UUIDV4, primaryKey: true },
        
        user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id' }, onDelete: "Cascade", onUpdate: "Cascade"  }, 
        business_type: { type: Sequelize.STRING, allowNull: false },
        business_location: { type: Sequelize.STRING, allowNull: false },
        amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        allocated_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        duration: { type: Sequelize.STRING, allowNull: false },
        repayment_plan: { type: Sequelize.STRING, allowNull: false },
        purpose: { type: Sequelize.STRING, allowNull: false },
        statement_of_account_doc: { type: Sequelize.STRING, allowNull: false },
        
        cluster_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'cluster',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      });
    })
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('funding_application');
  },
};
