import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';
import { SyncRequest } from './sync.types';
import { SyncService } from './sync.service';

@Controller('v1/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  runSync(@ParsedToken() user: User, @Body() body: SyncRequest) {
    return this.syncService.runSync(user.id, body);
  }

  @Get()
  pull(@ParsedToken() user: User, @Query('cursor') cursor?: string) {
    return this.syncService.runSync(user.id, { cursor, mutations: [] });
  }
}
