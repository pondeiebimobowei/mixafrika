import { Injectable } from '@nestjs/common';
import { User } from './database/models/user.model';
import { LoanAccount } from './database/models/loan-account.model';
import { Notification } from './database/models/notification.model';
import { Setting } from './database/models/setting.model';
import { RepaymentHistory } from './database/models/repayment-history.model';
import { Transaction } from './database/models/transaction.model';
import { Wallet } from './database/models/wallet.model';
import { Savings } from './database/models/saving.model';
import { FundingApplication } from './database/models/funding_application';
import { UserBusiness } from './database/models/user-business.model';

@Injectable()
export class AppService {
  async getHello() {
    const user = await User.findAll( { include: [ 
      { model: LoanAccount, include: [ { model: RepaymentHistory }] },
      { model: Notification },
      { model: Transaction },
      { model: Wallet },
      { model: Savings },
      { model: UserBusiness },
      { model: FundingApplication },
      { model: Setting }
    ]});

    return user
  }
}
