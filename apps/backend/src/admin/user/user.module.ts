import { Module } from '@nestjs/common';
import { AdminUserService } from './user.service';
import { UserController } from './user.controller';
import { UserModule } from '../../user/user.module';

@Module({
  providers: [AdminUserService],
  controllers: [UserController],
  imports: [UserModule],
})
export class AdminUserModule {}
