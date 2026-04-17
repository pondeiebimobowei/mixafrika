'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const syncStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('invites', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'accepted', 'declined', 'expired', 'cancelled'),
          defaultValue: 'pending',
          allowNull: false,
        },
        business_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'user_business', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        branch_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'branch', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        invited_by: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'user', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        sync_status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'pending',
        },
        sync_date: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      });
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('invites');
  },
};
