import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  Default,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { RepaymentHistory } from './repayment-history.model';
import { ILoanAccount } from '@shared/shared/src/types/loan-account';
import { CreationOptional, DataTypes } from 'sequelize';
import { LoanStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'loan_account' })
export class LoanAccount extends Model<ILoanAccount> implements ILoanAccount {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  received_amount: number;

  @Column(DataType.DECIMAL(15, 2))
  repaid_amount: number;

  @Column(DataType.DECIMAL(15, 2))
  repayment_amount: number;

  @Column(DataType.FLOAT)
  interest_rate: number;

  @Column(DataType.INTEGER)
  duration: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => RepaymentHistory)
  repayment_history: RepaymentHistory[];

  @Column(DataType.STRING)
  declare status: LoanStatus;

  @Column(DataType.STRING)
  declare approvedAt: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
