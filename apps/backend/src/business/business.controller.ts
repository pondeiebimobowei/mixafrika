import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { BusinessService } from './business.service';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { Submit_business, submit_business } from '@shared/shared/src/validation/submit-business-dto';

@Controller('v1/business')
export class BusinessController {
    constructor( private readonly businessService: BusinessService ){}

    @Get()
    getUserBusiness(@ParsedToken() user: User){
        return this.businessService.handleGetUserBusiness(user.id)
    }

    @Post()
    submitUserBusiness(
        @ParsedToken() user: User,
        @Body(new ZodPipe(submit_business)) submit_business: Submit_business
    ) {
        return this.businessService.handleSubmitUserBusiness(user.id, submit_business)
    }
}
