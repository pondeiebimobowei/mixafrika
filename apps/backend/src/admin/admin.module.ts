import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AdminUserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { InvestmentsModule } from './investments/investments.module';
import { AutditLogsModule } from './autdit_logs/autdit_logs.module';
import { FundingModule } from './funding/funding.module';

@Module({
  imports: [ UserModule, AdminUserModule, LoanModule, InvestmentsModule, AutditLogsModule, FundingModule],
})
export class AdminModule {}
