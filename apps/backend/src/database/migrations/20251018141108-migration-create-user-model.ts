const Roles = {
  USER: 'user',
  TRADER: 'trader',
  AGENT: 'agent',
  ADMIN: 'admin',
  SUBADMIN: 'subadmin',
} as const;

import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('user', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        user_name: { type: Sequelize.STRING, allowNull: true, unique: true },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        image: { type: Sequelize.STRING, allowNull: true },
        password: { type: Sequelize.STRING, allowNull: false },
        credit_score: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
        },
        credit_score_status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'not set',
        },
        is_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_email_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        role: {
          type: Sequelize.STRING,
          validate: { isIn: [Object.values(Roles)] },
          defaultValue: 'user',
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
    await queryInterface.dropTable('user');
  },
};
