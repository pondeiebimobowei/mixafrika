
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingApplicationDto, createFundingApplicationDto } from './dto/create-funding-application.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ParsedToken } from '../decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';
import { ZodPipe } from 'src/pipes/zod-pipes';

@Controller('funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodPipe(createFundingApplicationDto))
  async apply(
    @Body() createFundingApplicationDto: CreateFundingApplicationDto,
    @ParsedToken() token: IJwtToken,
    ) {
    return this.fundingService.create(createFundingApplicationDto, token.id );
  }
}
