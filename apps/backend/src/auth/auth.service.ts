import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '@shared/shared/src/enums';
import { Login_user_dto } from '@shared/shared/src/validation/login-user-dto';
import * as bcrypt from 'bcrypt';
import { Setting } from 'src/database/models/setting.model';
import { UserBusiness } from 'src/database/models/user-business.model';
import { User } from 'src/database/models/user.model';
import { Wallet } from 'src/database/models/wallet.model';
import { JwtPayload, verify, sign, } from 'jsonwebtoken';
import { Create_user_dto } from '@shared/shared/src/validation/create-user-dto';


@Injectable()
export class AuthService {

  constructor(private readonly configService: ConfigService ) {}
  
  async handleSignup(create_user_dto: Create_user_dto) {
    const jwtSecret = this.configService.get('access_token_secret');
    const jwtSecretRefresh = this.configService.get('refresh_token_secret');

    const passwordHash = await bcrypt.hash(create_user_dto.password, 10);
    const user = await User.create({ 
      first_name: create_user_dto.first_name, 
      last_name: create_user_dto.last_name, 
      email: create_user_dto.email,
      password: passwordHash,
      credit_score: 0,
      is_verified: false,
      credit_score_status: "not set",
      role: create_user_dto.role as Roles,
      is_email_verified: false,
      
    });

    await Wallet.create({
      user_id: user.id,
      available_balance: 0,
      active_investment_principal: 0,
      total_portfolio: 0,
    })

    await Setting.create({
      user_id: user.id,
      enable_dark_mode: false,
      enable_push_notification: false,
      enable_email_notification: true,
    })

    const payload = { id: user.id, email: user.email };

    const token = sign(payload, jwtSecret, { expiresIn: '1h' });
    const refresh_token = sign(payload, jwtSecretRefresh, { expiresIn: '1d' });
    
    return {
      success: true,
      message: "User created successfully",
      data: { token, refresh_token, user },
    };
  }

  async handleLogin(loginDto: Login_user_dto) {
    const jwtSecret = this.configService.get('access_token_secret');
    const jwtSecretRefresh = this.configService.get('refresh_token_secret');

    const user = await User.findOne({ where: { email: loginDto.email } });
    
    const valid = await bcrypt.compare(loginDto.password, user?.dataValues.password || '');
    if (!valid || !user) {
      throw new UnauthorizedException({ success: false, message: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email };

    const token = sign(payload, jwtSecret, { expiresIn: '1h' });
    const refresh_token = sign(payload, jwtSecretRefresh, { expiresIn: '1d' });

    return { success: true, data: { token, refresh_token, user }, message: "Login Successful" };
  }


  async refreshToken(token: string) {
    const jwtSecret = this.configService.get('access_token_secret');
    const jwtSecretRefresh = this.configService.get('refresh_token_secret');
    
    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try { 

      const decoded = verify(token, jwtSecretRefresh) as JwtPayload;
      delete decoded?.iat; 
      delete decoded?.exp;
      const newToken = sign(decoded, jwtSecret, { expiresIn: '1h' });
      const newRefreshToken = sign(decoded, jwtSecretRefresh, { expiresIn: '1d' });
      return { success: true, data: { token: newToken, refreshToken: newRefreshToken }, message: 'Tokens refreshed successfully'  };
    } catch (error:any) {
      throw new UnauthorizedException({
        message: error.message || 'Invalid refresh token',
        reason: 'TOKEN_EXPIRED',
      });
    }
  }

  async handleForgotPassword() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleResetPassword() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
