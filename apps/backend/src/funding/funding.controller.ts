
import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FundingService } from './funding.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ParsedToken } from '../decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Create_funding_application_dto, create_funding_application_dto } from '@shared/shared/src/validation/funding-application.dto';

@Controller('v1/funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Post('apply')
  @UseInterceptors(FileFieldsInterceptor([
        { name: 'statement', maxCount: 1 },
        { name: 'stat', maxCount: 1 },
  ]))
  @UseGuards(JwtAuthGuard)
  apply(
    @UploadedFiles() files: { statement?: Express.Multer.File[], state?: Express.Multer.File[] },
    @ParsedToken() token: IJwtToken,
    @Body( new ZodPipe(create_funding_application_dto)) createFundingApplicationDto: Create_funding_application_dto,
    ) {
      console.log('Files received:', files);
      console.log('DTO received:', createFundingApplicationDto);
    return this.fundingService.create(createFundingApplicationDto, token.id, files );
  }
}
