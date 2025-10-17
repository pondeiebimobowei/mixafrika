import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('v1/admin')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get('/users')
    getUsers(){
        return this.userService.handleGetUsers()
    }

    @Get('/users/:id')
    getUserById(){
        return this.userService.handleGetUsersById()
    }
}
