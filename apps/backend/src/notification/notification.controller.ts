import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ParsedToken } from '../decorators/parsed-token.decorator';
import { IJwtToken } from '@mixafrica/shared';

@Controller('v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotification(
    @ParsedToken() jwt: IJwtToken
  ) {
    return this.notificationService.handleGetNotifications(jwt.id);
  }

  @Patch(':notification_id')
  markNotificationAsOpened(@Param('notification_id') notification_id: string) {
    return this.notificationService.handleMarkNotificationsAsOpened(
      notification_id,
    );
  }
}
