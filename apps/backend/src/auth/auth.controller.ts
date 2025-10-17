import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {

    constructor (private readonly authService: AuthService ){}

    @Post('signup')
    signup(){
        return this.authService.handleSignup()
    }

    @Post('login')
    login(){
        return this.authService.handleLogin()
    }

    @Post('forgot-password')
    forgotPassword(){
        return this.authService.handleForgotPassword()
    }

    @Post('reset-password')
    resetPassord(){
        return this.authService.handleResetPassword()
    }


}
