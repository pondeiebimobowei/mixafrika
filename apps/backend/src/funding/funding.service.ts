import { Injectable } from '@nestjs/common';
import { FundingApplication } from '../database/models/funding_application';
import { CreateFundingApplicationDto } from '@shared/shared/src/validation/funding-application.dto';

@Injectable()
export class FundingService {

  async create( createFundingApplicationDto: CreateFundingApplicationDto, userId: string) {
    const data =  FundingApplication.create({
      ...createFundingApplicationDto,
      user_id: userId,
    });

    return {
      success: true,
      data,
      message: "Application Successful"
    }
  }
}
