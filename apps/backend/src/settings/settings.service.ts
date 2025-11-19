import { Injectable } from '@nestjs/common';
import { Setting } from 'src/database/models/setting.model';

@Injectable()
export class SettingsService {
  async handleGetSettings(user_id: string) {
    const data = await Setting.findOne({ where: { user_id }})

    return {
      success: true,
      message: 'User settings found!',
      data,
    };
  }

  async handleUpdateDarkMode(user_id: string, enable_dark_mode: boolean) {
    await Setting.update( { enable_dark_mode }, { where: { user_id}})
    return {
      success: true,
      message: 'Dark mode settings updated sucessfully',
      data: [],
    };
  }

  async handleUpdatePushNotification(user_id: string, enable_push_notification: boolean) {
    await Setting.update( { enable_push_notification }, { where: { user_id}})
    return {
      success: true,
      message: 'Push notification settings updated sucessfully',
      data: [],
    };
  }

  async handleUpdateEmailNotification(user_id: string, enable_email_notification: boolean) {
    await Setting.update( { enable_email_notification }, { where: { user_id}})
    return {
      success: true,
      message: 'Email notification settings updated sucessfully',
      data: [],
    };
  }
}
