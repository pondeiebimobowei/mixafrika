import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { Create_user_dto, create_user_dto } from '@shared/shared/src/validation/create-user-dto';
import { Login_user_dto } from '@shared/shared/src/validation/login-user-dto';
import { Public } from 'src/decorators/public.decorator';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @UsePipes(new ZodPipe(create_user_dto))
  signup(@Body() create_user_dto: Create_user_dto) {
    return this.authService.handleSignup(create_user_dto);
  }
  
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() login_user_dto: Login_user_dto) {
    return this.authService.handleLogin(login_user_dto);
  }
  
  @Post('refresh')
  @Public()
  refreshToken(@Body() body: { refreshToken: string }){
    return this.authService.refreshToken(body.refreshToken);
  }
  
  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  forgotPassword() {
    return this.authService.handleForgotPassword();
  }
  
  @Post('reset-password')
  @Public()
  resetPassord() {
    return this.authService.handleResetPassword();
  }

  @Get('sync')
  sync(@ParsedToken() user: User) {
    return this.authService.handleSync(user.id);
  }
}
