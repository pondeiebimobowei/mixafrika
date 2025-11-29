import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
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
    declare loan_account_id: string;

    @Column(DataType.DECIMAL(15, 2))
    declare amount: number;

    @Column(DataType.STRING)
    declare status: RepaymentStatus;

    @BelongsTo(() => LoanAccount)
    declare loan_account: LoanAccount;

    @CreatedAt
    declare createdAt: string;
  
    @UpdatedAt
    declare updatedAt: string;
  
    @DeletedAt
    declare deletedAt?: string;
}
