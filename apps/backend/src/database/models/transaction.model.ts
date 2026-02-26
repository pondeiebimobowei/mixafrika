import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  PrimaryKey,
  Default,
  Validate,
} from 'sequelize-typescript';
import { ITransaction } from '@shared/shared/src/types/transaction';
import { RepaymentStatus, Status, Types } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';

@Table({ tableName: 'transaction' })
export class Transaction extends Model<ITransaction> implements ITransaction {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @Column(DataType.STRING)
  declare type: Types;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.DECIMAL(15, 2))
  declare amount: number;

  @Column(DataType.STRING)
  declare category: string;

  @Validate({ isIn: [[...Object.values(Status), ...Object.values(RepaymentStatus)]] })
  @Column(DataType.STRING)
  declare status: Status | RepaymentStatus;

  @BelongsTo(() => User)
  declare loan_account: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
