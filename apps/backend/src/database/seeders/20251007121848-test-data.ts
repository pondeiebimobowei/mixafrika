'use strict';
import { v4 as uuidv4 } from 'uuid';
import { mockUserSeed } from "../data/user.mock";
import { mockNotificationSeed } from '../data/notification.mock';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {

      const users = await mockUserSeed()
      const responseUser = await queryInterface.bulkInsert('user', users, { returning: true, transaction: t });
      
      const userWallets = responseUser.map((u) => ({
        id: uuidv4(), 
        user_id: u.id,
        amount: 0,
        total_portfolio: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      const userSettings = responseUser.map((u) => ({
        id: uuidv4(), 
        user_id: u.id,
        enable_dark_mode: true,
        enable_email_notification: true,
        enable_push_notification: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));



      await queryInterface.bulkInsert('setting', userSettings, { transaction: t });
      await queryInterface.bulkInsert('wallet', userWallets, { transaction: t });
      
      const notification = await mockNotificationSeed(responseUser)
      await queryInterface.bulkInsert('notification', notification, { transaction: t });
      
      await queryInterface.bulkInsert('loan_account', [{
        id: uuidv4(),
        duration: 12,
        interest_rate: 5,
        received_amount: 12000,
        repaid_amount: 600,
        repayment_amount: 200,
        user_id: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }],
      { transaction: t }
    )


      
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete('user', null, { transaction: t });
      await queryInterface.bulkDelete('cluster', null, { transaction: t });
      await queryInterface.bulkDelete('feed', null, { transaction: t });
      await queryInterface.bulkDelete('funding_application', null, { transaction: t });
      await queryInterface.bulkDelete('goal', null, { transaction: t });
      await queryInterface.bulkDelete('investment', null, { transaction: t });
      await queryInterface.bulkDelete('loan_account', null, { transaction: t });
      await queryInterface.bulkDelete('loan_history', null, { transaction: t });
      await queryInterface.bulkDelete('notification', null, { transaction: t });
      await queryInterface.bulkDelete('repayment_history', null, { transaction: t });
      await queryInterface.bulkDelete('saving_history', null, { transaction: t });
      await queryInterface.bulkDelete('saving', null, { transaction: t });
      await queryInterface.bulkDelete('setting', null, { transaction: t });
      await queryInterface.bulkDelete('transaction', null, { transaction: t });
      await queryInterface.bulkDelete('update', null, { transaction: t });
      await queryInterface.bulkDelete('wallet', null, { transaction: t });
    });
  },
};
