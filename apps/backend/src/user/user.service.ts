import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    async handleGetUserProfile(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleUpdateUserProfile(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleGetCreditScore(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleGetUsers(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleGetUsersById(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }
}
