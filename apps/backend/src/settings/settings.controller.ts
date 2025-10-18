import { Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSeetings() {
    return this.settingsService.handleGetSettings();
  }

  @Patch()
  updateSettings() {
    return this.settingsService.handleUpdateSettings();
  }
}
