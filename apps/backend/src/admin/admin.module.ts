import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AdminUserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { InvestmentsModule } from './investments/investments.module';
import { AutditLogsModule } from './autdit_logs/autdit_logs.module';
import { FundingModule } from './funding/funding.module';
import { AdminCollectionModule } from './collection/collection.module';
import { CollectionModule } from 'src/collection/collection.module';
import { AdminDashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    UserModule,
    CollectionModule,
    AdminUserModule,
    LoanModule,
    InvestmentsModule,
    AutditLogsModule,
    FundingModule,
    AdminCollectionModule,
    AdminDashboardModule,
  ],
})
export class AdminModule {}
