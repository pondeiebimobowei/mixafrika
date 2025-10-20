'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

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

        name: { type: Sequelize.STRING, allowNull: false },
        category: { type: Sequelize.STRING, allowNull: false },
        roi: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        repayment: { type: Sequelize.STRING, allowNull: false },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        description: { type: Sequelize.STRING, allowNull: false },

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
