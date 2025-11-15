import { Module } from '@nestjs/common';
import { FundingService } from './funding.service';
import { FundingController } from './funding.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [FundingService],
  controllers: [FundingController],
})
export class FundingModule {}
