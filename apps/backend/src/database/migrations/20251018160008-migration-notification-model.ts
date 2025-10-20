'use strict';
import { Roles } from '@shared/shared/src/enums';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('notification', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING, allowNull: false },
        message: { type: Sequelize.TEXT, allowNull: false },
        read: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    await queryInterface.dropTable('notification');
  },
};
