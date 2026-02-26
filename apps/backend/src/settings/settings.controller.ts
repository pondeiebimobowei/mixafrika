import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSeetings(
    @ParsedToken() jwt: IJwtToken,
  ) {
    return this.settingsService.handleGetSettings(jwt.id);
  }

  @Patch('/dark-mode')
  updateDarkMode(
    @ParsedToken() jwt: IJwtToken,
    @Body() { enable_dark_mode }: { enable_dark_mode : boolean },
  ) {
    return this.settingsService.handleUpdateDarkMode(jwt.id, enable_dark_mode);
  }

  @Patch('/email-notification')
  updateEmailNotification(
    @ParsedToken() jwt: IJwtToken,
    @Body() { enable_email_notification }: { enable_email_notification: boolean },
  ) {
    return this.settingsService.handleUpdateEmailNotification(jwt.id, enable_email_notification);
  }

  @Patch('push-notification')
  updatePushNotification(
    @ParsedToken() jwt: IJwtToken,
    @Body() { enable_push_notification }: { enable_push_notification: boolean }, 
  ) {
    return this.settingsService.handleUpdatePushNotification(jwt.id, enable_push_notification);
  }
  
}
