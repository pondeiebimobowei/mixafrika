import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async handleGetNotifications() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleMarkNotificationsAsOpened(notification_id) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
