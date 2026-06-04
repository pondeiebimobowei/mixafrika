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
import { Business } from './database/models/business.model';
import { Cluster } from './database/models/cluster.model';
import { Feed } from './database/models/feed.model';
import { Goal } from './database/models/goal.model';
import { Investment } from './database/models/investment.model';
import { LoanHistory } from './database/models/loan-history.model';
import { SavingsHistory } from './database/models/saving-history.model';
import { Collection } from './database/models/collection.model';
import { BankCard } from './database/models/bank-card.model';
import { BusinessVerification } from './database/models/business-verification.model';
import { UserVerification } from './database/models/user-verification';
import { BusinessUser } from './database/models/business-user';
import { Branch } from './database/models/branch.model';
import { Inventory } from './database/models/inventory.model';
import { Product } from './database/models/product.model';

@Injectable()
export class AppService {
  async getHello() {
    const user = await User.findAll({
      include: [
        { model: LoanAccount, include: [{ model: RepaymentHistory }, { model: FundingApplication, include: [{ model: Cluster, include: [Collection] }] }] },
        { model: BankCard },
        { model: Notification },
        { model: LoanHistory },
        { model: Feed },
        { model: UserVerification },
        { model: Transaction },
        { model: Wallet },
        { model: Goal },
        { model: Investment },
        { model: Savings, include: [SavingsHistory] },
        {
          model: Business, include: [{
            model: User,
            attributes: [],
            required: true,
          }, {
            model: Branch,
            include: [
              { model: Product }

            ]
          },
        ]
        },
        { model: FundingApplication },
        { model: Setting }
      ]
    });

    return user
  }
}
