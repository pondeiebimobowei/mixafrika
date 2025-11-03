import { Controller, Get } from '@nestjs/common';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { BusinessService } from './business.service';

@Controller('v1/business')
export class BusinessController {
    constructor( private readonly businessService: BusinessService ){}

    @Get()
    getUserBusiness(@ParsedToken() user: User){
        return this.businessService.handleGetUserBusiness(user.id)
    }
}
