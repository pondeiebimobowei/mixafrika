import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getUserProfile(@ParsedToken() user: User) {
    return this.userService.handleGetUserProfile(user.id);
  }

  @Patch('')
  updateUserProfile() {
    return this.userService.handleUpdateUserProfile();
  }

  @Get('credit-score')
  getUserCreditScore() {
    return this.userService.handleGetCreditScore();
  }
}
