import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { SavingsModule } from './savings/savings.module';
import { GoalsModule } from './goals/goals.module';
import { FundingModule } from './funding/funding.module';
import { InvestmentModule } from './investment/investment.module';
import { ClusterModule } from './cluster/cluster.module';
import { NotificationModule } from './notification/notification.module';
import { FeedModule } from './feed/feed.module';
import { UpdateModule } from './update/update.module';
import { SystemModule } from './system/system.module';
import { AdminModule } from './admin/admin.module';
import { LoanAccountHistoryModule } from './loan_history/loan_history.module';
import { SettingsModule } from './settings/settings.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSequelizeConfig } from './database/setup';
import { User } from './database/models/user.model';
import { Wallet } from './database/models/wallet.model';
import { LoanAccount } from './database/models/loan-account.model';
import { Savings } from './database/models/saving.model';
import { Goal } from './database/models/goal.model';
import { Investment } from './database/models/investment.model';
import { Notification } from './database/models/notification.model';
import { Feed } from './database/models/feed.model';
import { Cluster } from './database/models/cluster.model';
import { LoanHistory } from './database/models/loan-history.model';
import { RepaymentHistory } from './database/models/repayment-history.model';
import { SavingsHistory } from './database/models/saving-history.model';
import { Setting } from './database/models/setting.model';
import { Update } from './database/models/update.model';
import { Business } from './database/models/business.model';
import { Transaction } from './database/models/transaction.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BusinessModule } from './business/business.module';
import { LoggerMiddleware } from './logger/logger.service';
import { GlobalModule } from './global/global.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FundingApplication } from './database/models/funding_application';
import { LoanAccountModule } from './loan_account/loan_account.module';
import { LoanRepaymentHistoryModule } from './loan_repayment_history/loan_repayment_history.module';
import { Collection } from './database/models/collection.model';
import { CollectionModule } from './collection/collection.module';
import { BankCard } from './database/models/bank-card.model';
import { BankCardModule } from './bank_card/bank_card.module';
import { SavingsHistoryModule } from './savings_history/savings_history.module';
import { UserVerification } from './database/models/user-verification';
import { BusinessVerification } from './database/models/business-verification.model';
import { BatchModule } from './batch/batch.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { SalesItemModule } from './sales_item/sales_item.module';
import { ProductModule } from './product/product.module';
import { Product } from './database/models/product.model';
import { Batch } from './database/models/batch.model';
import { Inventory } from './database/models/inventory.model';
import { Sales } from './database/models/sales.model';
import { SalesItem } from './database/models/sales-item.model';
import { Branch } from './database/models/branch.model';
import { BusinessUser } from './database/models/business-user';
import { Invites } from './database/models/invites.model';
import { BranchUser } from './database/models/branch-user';
import { TeamModule } from './team/team.module';
import { BranchModule } from './branch/branch.module';
import { AccessModule } from './access/access.module';
import { SyncModule } from './sync/sync.module';
import { Customer } from './database/models/customer';
import { Payment } from './database/models/payments';
import { StockMovement } from './database/models/stock-movement';
import { StockTransfer } from './database/models/stock-transfer.model';
import { StockTransferItem } from './database/models/stock-transfer-item';
import { GlobalProduct } from './database/models/global-product';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WalletModule,
    TransactionModule,
    SavingsModule,
    GoalsModule,
    FundingModule,
    InvestmentModule,
    ClusterModule,
    NotificationModule,
    FeedModule,
    UpdateModule,
    SystemModule,
    AdminModule,
    LoanAccountHistoryModule,
    SettingsModule,
    SequelizeModule.forFeature([User, BusinessUser, BusinessUser, BranchUser, Invites, UserVerification, Branch, BusinessVerification, Savings, FundingApplication, Goal, BankCard, Investment, Notification, Feed, Cluster, Collection, LoanHistory, RepaymentHistory, SavingsHistory, Setting, Update, Business, Transaction, Wallet, LoanAccount, Product, Batch, Inventory, Sales, SalesItem, Customer, Payment, StockMovement, StockTransfer, StockTransferItem, GlobalProduct]),
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    BusinessModule,
    GlobalModule,
    CloudinaryModule,
    LoanAccountModule,
    LoanRepaymentHistoryModule,
    CollectionModule,
    BankCardModule,
    SavingsHistoryModule,
    BatchModule,
    InventoryModule,
    SalesModule,
    SalesItemModule,
    ProductModule,
    TeamModule,
    BranchModule,
    AccessModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
