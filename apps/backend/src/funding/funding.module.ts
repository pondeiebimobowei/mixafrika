import { Module } from '@nestjs/common';
import { FundingService } from './funding.service';
import { FundingController } from './funding.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LoanAccountService } from '../loan_account/loan_account.service';

@Module({
  imports: [CloudinaryModule],
  providers: [FundingService, LoanAccountService],
  controllers: [FundingController],
})
export class FundingModule {}
