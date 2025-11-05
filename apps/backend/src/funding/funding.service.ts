import { Injectable } from '@nestjs/common';
import { FundingApplication } from '../database/models/funding_application';
import { CreateFundingApplicationDto } from './dto/create-funding-application.dto';

@Injectable()
export class FundingService {

  async create(
    createFundingApplicationDto: CreateFundingApplicationDto,
    userId: string,  
  ) {
    FundingApplication.create({
      ...createFundingApplicationDto,
      user_id: userId,
    });
  }
}
