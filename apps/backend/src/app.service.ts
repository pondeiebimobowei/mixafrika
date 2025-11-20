import { Injectable } from '@nestjs/common';
import { User } from './database/models/user.model';
import { LoanAccount } from './database/models/loan-account.model';
import { Notification } from './database/models/notification.model';
import { Setting } from './database/models/setting.model';
import { RepaymentHistory } from './database/models/repayment-history.model';

@Injectable()
export class AppService {
  async getHello() {
    const user = await User.findAll( { include: [ 
      { model: LoanAccount, include: [ { model: RepaymentHistory }] },
      { model: Notification },
      { model: Setting }
    ]});

    return user
  }
}
