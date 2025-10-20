import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { Create_user_dto, create_user_dto } from '@shared/shared/src/validation/create-user-dto';
import { Login_user_dto } from '@shared/shared/src/validation/login-user-dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodPipe(create_user_dto))
  signup(@Body() create_user_dto: Create_user_dto) {
    return this.authService.handleSignup(create_user_dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() login_user_dto: Login_user_dto) {
    return this.authService.handleLogin(login_user_dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword() {
    return this.authService.handleForgotPassword();
  }

  @Post('reset-password')
  resetPassord() {
    return this.authService.handleResetPassword();
  }
}
