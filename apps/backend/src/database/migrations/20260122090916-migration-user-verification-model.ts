'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const VerificationStatus = {
    PENDING: "pending",
    VERIFIED: "verified",
    UNVERIFIED: 'unverified',
    REJECTED: "rejected",
} as const;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('user_verification', {
        id: {
          type: Sequelize.UUID,
          defaultValue: sequelize.UUIDV4,
          primaryKey: true,
        },

        user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(VerificationStatus)]} },
        id_type: { type: Sequelize.STRING, allowNull: false },
        id_number: { type: Sequelize.STRING, allowNull: false },
        id_image_front: { type: Sequelize.STRING, allowNull: false },
        id_image_back: { type: Sequelize.STRING, allowNull: false },
        rejection_reason: { type: Sequelize.STRING, allowNull: false },
        reviewed_by_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        reviewed_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('user_verification');
  },
};
