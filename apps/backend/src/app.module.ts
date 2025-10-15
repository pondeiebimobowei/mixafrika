import { Module } from '@nestjs/common';
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
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [AuthModule, UserModule, WalletModule, TransactionModule, SavingsModule, GoalsModule, FundingModule, InvestmentModule, ClusterModule, NotificationModule, FeedModule, UpdateModule, SystemModule, AdminModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
