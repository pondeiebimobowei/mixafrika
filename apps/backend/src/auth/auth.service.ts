import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    async handleSignup(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleLogin(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleForgotPassword(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleResetPassword(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }
}
