import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('v1/notification')
export class NotificationController {

    constructor( private readonly notificationService: NotificationService){}

    @Get()
    getNotification(){
        this.notificationService.handleGetNotifications()
    }

    @Patch(":notification_id")
    markNotificationAsOpened(@Param("notification_id") notification_id: string){
        return this.notificationService.handleMarkNotificationsAsOpened(notification_id)
    }
}
