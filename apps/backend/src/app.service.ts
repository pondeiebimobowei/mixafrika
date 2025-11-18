import { Injectable } from '@nestjs/common';
import { User } from './database/models/user.model';
import { LoanAccount } from './database/models/loan-account.model';
import { Notification } from './database/models/notification.model';

@Injectable()
export class AppService {
  async getHello() {
    const user = await User.findAll( { include: [Notification, LoanAccount]});

    return user

    // return 'Hello World!';
  }
}
