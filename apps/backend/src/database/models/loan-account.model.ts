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
import { FundingApplication } from './funding_application';
import { Cluster } from './cluster.model';

@Table({ tableName: 'loan_account' })
export class LoanAccount extends Model<ILoanAccount> {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  declare disbursed_amount: number;

  @Column(DataType.STRING)
  declare status: LoanStatus;

  @Column(DataType.DECIMAL(15, 2))
  declare repaid_amount: number;

  @Column(DataType.DECIMAL(15, 2))
  declare daily_repayment_amount: number;

  @Column(DataType.DECIMAL(15, 2))
  declare total_repayment_amount: number;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => FundingApplication)
  declare application: FundingApplication;

  @BelongsTo(() => Cluster)
  declare cluster?: Cluster;

  @HasMany(() => RepaymentHistory)
  declare repayment_history: RepaymentHistory[];

  @ForeignKey(() => FundingApplication)
  declare application_id: string;

  @ForeignKey(() => Cluster)
  declare cluster_id: string;


  @Column({type: DataType.DATE, allowNull: true })
  declare approved_at: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
