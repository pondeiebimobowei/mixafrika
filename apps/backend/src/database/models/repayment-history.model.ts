import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { LoanAccount } from './loan-account.model';
import { IRepaymentHistory } from '@shared/shared/src/types/repayment-history';
import { RepaymentStatus } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'repayment_history' })
export class RepaymentHistory
  extends Model<IRepaymentHistory>
  implements IRepaymentHistory
{
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

  @ForeignKey(() => LoanAccount)
  @Column
  loan_account_id: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  status: RepaymentStatus;

  @BelongsTo(() => LoanAccount)
  loan_account: LoanAccount;
}
