'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      
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
