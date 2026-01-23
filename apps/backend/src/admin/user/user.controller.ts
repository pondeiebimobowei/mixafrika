import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('v1/admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  getUsers() {
    return this.userService.handleGetUsers();
  }

  @Get('/user/:id')
  getUserById() {
    return this.userService.handleGetUsersById();
  }
}
