'use strict';
import sequelize from 'sequelize';
import { QueryInterface, DataTypes } from 'sequelize';

const verificationStatus = {
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

        type: { type: Sequelize.STRING, allowNull: false },
        id_number: { type: Sequelize.STRING, allowNull: false },
        id_image_front_url: { type: Sequelize.STRING, allowNull: false },
        id_image_back_url: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [Object.values(verificationStatus)]} },
        rejection_reason: { type: Sequelize.STRING, allowNull: false },
        submitted_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        reviewed_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },

        reviewed_by: { type: Sequelize.UUID, allowNull: true, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },
        user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'user', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' },


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
