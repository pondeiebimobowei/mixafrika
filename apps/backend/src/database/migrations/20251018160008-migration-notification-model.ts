'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const Types = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    DISBURSEMENT: "disbursement",
    INVESTMENT: "investment",
    LOAN: "loan",
    REPAYMENT: "repayment",
} as const;


const NotificationType = {
    ...Types,
    
    GOAL: "goal",
    SYSTEM: "system",
    INVESTMENT: "investment",
    NEW_FOLLOWING: "new_following",
    NEW_LIKE: "new_like",
    NEW_COMMENT: "new_comment"
} as const;


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
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        title: { type: Sequelize.STRING, allowNull: false },
        message: { type: Sequelize.TEXT, allowNull: false },
        read: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.keys(NotificationType)]
          }
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
