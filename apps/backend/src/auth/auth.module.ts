import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [SyncModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
