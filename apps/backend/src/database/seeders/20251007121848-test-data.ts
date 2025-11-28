'use strict';
import { v4 as uuidv4 } from 'uuid';
import { mockUserSeed } from "../data/user.mock";
import { mockNotificationSeed } from '../data/notification.mock';
import { mockInvestorSeed } from '../data/investor.mock';
import { mockLoanRepaySeed } from '../data/loan-repayment.mock';
import { mockTransactionsSeed } from '../data/transactions.mock';
import { mockApplicationSeed } from '../data/application.mock';
import { mockClusterSeed } from '../data/cluster.mock';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {


      const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randomBool = () => Math.random() < 0.5;

      const users = await mockUserSeed()
      const investors = await mockInvestorSeed()
      const transactions = await mockTransactionsSeed([...users, ...investors])
      const clusters = await mockClusterSeed();
      await queryInterface.bulkInsert('cluster', clusters, { returning: true, transaction: t });
      const application = await mockApplicationSeed(users, clusters)

      const responseUser = await queryInterface.bulkInsert('user', users, { returning: true, transaction: t });
      const responseInvestor = await queryInterface.bulkInsert('user', investors, { returning: true, transaction: t });
      await queryInterface.bulkInsert('transaction', transactions, { returning: true, transaction: t });
      await queryInterface.bulkInsert('funding_application', application, { returning: true, transaction: t });
    
      const userWallets = [...responseUser, ...responseInvestor].map((u) => ({
        id: uuidv4(),
        user_id: u.id,
        amount: randomNumber(20000, 15000000),            
        total_portfolio: randomNumber(5000, 500000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      const userSettings = [...responseUser, ...responseInvestor].map((u) => ({
        id: uuidv4(),
        user_id: u.id,
        enable_dark_mode: randomBool(),
        enable_email_notification: randomBool(),
        enable_push_notification: randomBool(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await queryInterface.bulkInsert('setting', userSettings, { transaction: t });
      await queryInterface.bulkInsert('wallet', userWallets, { transaction: t });
      
      const notificationUser = await mockNotificationSeed([...responseUser, responseUser[0], responseInvestor[1]])
      await queryInterface.bulkInsert('notification', notificationUser, { transaction: t });
      
      const loan_account = await queryInterface.bulkInsert('loan_account', [{
        user_id: users[0].id,
        id: uuidv4(),
        application_id: application[0].id,
        received_amount: application[0].amount,
        status: 'approved',
        repaid_amount: 0,
        repayment_amount: application[0].amount * 1.15,
        interest_rate: 15,
        duration: 30,
        approvedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }],

      
      { 
        returning: true,
        transaction: t }
      )

      const repayment_history = await mockLoanRepaySeed(loan_account)
      const rh = await queryInterface.bulkInsert('repayment_history', repayment_history, { returning: true, transaction: t });      
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
