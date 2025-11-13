import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Notification } from 'src/database/models/notification.model';

@Injectable()
export class NotificationService {
  async handleGetNotifications(user_id: string) {
    const now = dayjs();

    const startOfWeek = now.startOf('week').toDate();
    const startOfLastWeek = now.subtract(1, 'week').startOf('week').toDate();
    const endOfLastWeek = now.subtract(1, 'week').endOf('week').toDate();

    const allNotifications = await Notification.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    const grouped = {
      today: [] as Notification[],
      thisWeek: [] as Notification[],
      lastWeek: [] as Notification[],
      older: [] as Notification[],
    };

    for (const notif of allNotifications) {
      const created = dayjs(notif.createdAt);

      if (created.isSame(now, 'day')) {
        grouped.today.push(notif);
      } else if (created.isAfter(startOfWeek)) {
        grouped.thisWeek.push(notif);
      } else if (created.isAfter(startOfLastWeek) && created.isBefore(endOfLastWeek)) {
        grouped.lastWeek.push(notif);
      } else {
        grouped.older.push(notif);
      }
    }

    return {
      success: true,
      message: 'Notifications grouped successfully',
      data: grouped,
    };
  }

  async handleMarkNotificationsAsOpened(notification_id: string) {
    await Notification.update(
      { read: true },
      { where: { id: notification_id } },
    );

    return {
      success: true,
      message: `Notification ${notification_id} marked as read`,
      data: [],
    };
  }
}
