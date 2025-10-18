import { Controller, Get } from '@nestjs/common';
import { UpdateService } from './update.service';

@Controller('v1/update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Get()
  getUpdates() {
    return this.updateService.handleGetUpdates();
  }
}
