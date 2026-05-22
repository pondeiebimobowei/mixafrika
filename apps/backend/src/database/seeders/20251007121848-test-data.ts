'use strict';
import { v4 as uuidv4 } from 'uuid';
import { mockUserSeed } from "../data/user.mock";
import { mockNotificationSeed } from '../data/notification.mock';
import { mockInvestorSeed } from '../data/investor.mock';
import { mockLoanRepaySeed } from '../data/loan-repayment.mock';
import { mockTransactionsSeed } from '../data/transactions.mock';
import { mockApplicationSeed } from '../data/application.mock';
import { mockClusterSeed } from '../data/cluster.mock';
import { mockColectionSeed } from '../data/collection.mock';
import { mockBankCardSeed } from '../data/bank-card.mock';
import { mockBusinessVerificationSeed } from '../data/business-verification.mock';
import { mockUserVerificationSeed } from '../data/user-verification.mock';
import { LoanAccount } from '../models/loan-account.model';
import { mockBusinessUserSeed } from '../data/business_user.mock';
import { mockBranchUserSeed } from '../data/branch_user.mock';
import { mockBranchSeed } from '../data/branch.mock';
import { IUser } from '@shared/shared/src/types/user';
import { IBusiness } from '@shared/shared/src/types/business';
  
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {


      const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randomBool = () => Math.random() < 0.5;

      const users = await mockUserSeed()
      const investors = await mockInvestorSeed()
      const collection = await mockColectionSeed()
      const transactions = await mockTransactionsSeed([...users, ...investors])
      const clusters = await mockClusterSeed(collection);
      const bankCards = await mockBankCardSeed(users);
      const responseCollection = await queryInterface.bulkInsert('collection', collection, { returning: true, transaction: t });
      await queryInterface.bulkInsert('cluster', clusters, { returning: true, transaction: t });

      const responseUser = await queryInterface.bulkInsert('user', users, { returning: true, transaction: t }) as IUser[];
      const responseInvestor = await queryInterface.bulkInsert('user', investors, { returning: true, transaction: t }) as IUser[];
      await queryInterface.bulkInsert('transaction', transactions, { returning: true, transaction: t });

      await queryInterface.bulkInsert('bank_card', bankCards, { returning: true, transaction: t });

      const userWallets = [...responseUser, ...responseInvestor].map((u) => ({
        id: uuidv4(),
        user_id: u.id,
        available_balance: randomNumber(20000, 15000000),            
        active_investment_principal: randomNumber(20000, 15000000),            
        total_portfolio: randomNumber(5000, 500000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const Business: IBusiness[] = [...responseUser].map((u) => ({
        id: uuidv4(),
        name: 'Trader Business1',
        type: 'business',
        phone: '08023467856',
        street_address: '123 Main St',
        city: 'Gwarimpa',
        state: 'Abuja',
        country: 'Nigeria',
        is_verified: true,
        sync_status: 'pending',
        sync_date: "2025-11-20T23:05:31.906Z",
        

        deletedAt: undefined,
        createdAt: "2025-11-20T23:05:31.906Z",
        updatedAt: "2025-11-20T23:05:31.906Z",
      }));

      const Business2 = [...responseInvestor].map((u) => ({
        id: uuidv4(),
        name: 'Trader Business2',
        type: 'business',
        phone: '08023467856',
        street_address: '123 Main St',
        city: 'Gwarimpa',
        state: 'Abuja',
        country: 'Nigeria',
        is_verified: true,
        sync_status: 'pending',
        sync_date: new Date(),

        deletedAt: undefined,
        createdAt: "2025-11-20T23:05:31.906Z",
        updatedAt: "2025-11-20T23:05:31.906Z",
      }));
      
      const application = await mockApplicationSeed(users, clusters, Business)

      
      
      
      
      await queryInterface.bulkInsert('business', Business, { transaction: t });
      await queryInterface.bulkInsert('business', Business2, { transaction: t });
      await queryInterface.bulkInsert('funding_application', application, { returning: true, transaction: t });
      
      const branch = await mockBranchSeed(Business, responseCollection);
      await queryInterface.bulkInsert('branch', branch, { returning: true, transaction: t });

      const businessUsers = await mockBusinessUserSeed([...users, ...investors], [...Business, ...Business2])
      const branchUser = await mockBranchUserSeed(responseUser, branch)

      await queryInterface.bulkInsert('business_user', businessUsers, { returning: true, transaction: t });
      await queryInterface.bulkInsert('branch_user', branchUser, { returning: true, transaction: t });
      
      
      const userVerification = await mockUserVerificationSeed(users);
      await queryInterface.bulkInsert('user_verification', userVerification, { transaction: t });
      
      const businessVerifications = await mockBusinessVerificationSeed(Business, users);
      await queryInterface.bulkInsert('business_verification', businessVerifications, { transaction: t });
      
      
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
      
      const notificationUser = await mockNotificationSeed([responseUser[0], responseInvestor[0], responseInvestor[1]])
      await queryInterface.bulkInsert('notification', notificationUser, { transaction: t });

      const loan_account_tx = await queryInterface.bulkInsert('transaction', [
        {
            id: uuidv4(),
            amount: application[0].allocated_amount,
            category: 'loan',
            status: 'active',
            title: 'Loan Disbursement',
            type: 'loan',
            user_id: users[0].id as string,
            createdAt: new Date(),
            updatedAt: new Date()
          }
      ],
    {
      returning: true,
      transaction: t
    });

    const daily_repayment_amount = Number(application[0].allocated_amount * 1.15) / Number(application[0].duration);

      const loan_account: LoanAccount[] = await queryInterface.bulkInsert('loan_account', [{
        id: uuidv4(),
        user_id: users[0].id,
        application_id: application[0].id,
        cluster_id: application[0].cluster_id,
        disbursed_amount: application[0].allocated_amount,
        transaction_id: loan_account_tx[0].id,
        status: 'approved',
        repaid_amount: 0,
        daily_repayment_amount,
        total_repayment_amount: Number(application[0].allocated_amount * 1.15),
        approved_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }],

      
      { 
        returning: true,
        transaction: t }
      )

      const repayment_tx = await queryInterface.bulkInsert('transaction', [
        {
            id: uuidv4(),
            amount: daily_repayment_amount * 2 ,
            category: 'repayment',
            status: 'active',
            title: 'Loan Repayment',
            type: 'repayment',
            user_id: users[0].id as string,
            createdAt: new Date(),
            updatedAt: new Date()
          }
      ],
    {
      returning: true,
      transaction: t
    });

      const repayment_history = await mockLoanRepaySeed(loan_account, repayment_tx)
      const rh = await queryInterface.bulkInsert('repayment_history', repayment_history, { returning: true, transaction: t });      
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete('user', null, { transaction: t });
      await queryInterface.bulkDelete('bank_card', null, { transaction: t });
      await queryInterface.bulkDelete('business_verification', null, { transaction: t });
      await queryInterface.bulkDelete('cluster', null, { transaction: t });
      await queryInterface.bulkDelete('collection', null, { transaction: t });
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
      await queryInterface.bulkDelete('business', null, { transaction: t });
      await queryInterface.bulkDelete('user_verification', null, { transaction: t });
      await queryInterface.bulkDelete('business_user', null, { transaction: t });
      await queryInterface.bulkDelete('branch_user', null, { transaction: t });
      await queryInterface.bulkDelete('branch', null, { transaction: t });
    });
  },
};
