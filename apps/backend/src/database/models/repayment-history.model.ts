import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LoanAccount } from './loan-account.model';
import { IRepaymentHistory } from '@shared/shared/src/types/repayment-history';
import { PaymentStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'repayment_history' })
export class RepaymentHistory extends Model<IRepaymentHistory> implements IRepaymentHistory {
  @ForeignKey(() => LoanAccount)
  @Column
  loan_account_id: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  status: PaymentStatus;

  @BelongsTo(() => LoanAccount)
  loan_account: LoanAccount;
}
