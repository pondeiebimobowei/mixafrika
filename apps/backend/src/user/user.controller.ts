import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('profile')
    getUserProfile(){
        return this.userService.handleGetUserProfile()
    }

    @Patch('profile')
    updateUserProfile(){
        return this.userService.handleUpdateUserProfile()
    }

    @Get('credit-score')
    getUserCreditScore(){
        return this.userService.handleGetCreditScore()
    }
    
}
