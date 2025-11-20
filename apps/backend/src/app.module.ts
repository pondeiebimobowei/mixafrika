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
import { LoanModule } from './loan_history/loan_history.module';
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
import { UserBusiness } from './database/models/user-business.model';
import { Transaction } from './database/models/transaction.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BusinessModule } from './business/business.module';
import { LoggerMiddleware } from './logger/logger.service';
import { GlobalModule } from './global/global.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FundingApplication } from './database/models/funding_application';
import { LoanAccountModule } from './loan_account/loan_account.module';

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
    LoanModule,
    SettingsModule,
    SequelizeModule.forFeature([User, Savings, FundingApplication, Goal, Investment, Notification, Feed, Cluster, LoanHistory, RepaymentHistory, SavingsHistory, Setting, Update, UserBusiness, Transaction, Wallet, LoanAccount]),
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    BusinessModule,
    GlobalModule,
    CloudinaryModule,
    LoanAccountModule,
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
