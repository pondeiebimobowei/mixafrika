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
} from 'sequelize-typescript';
import { LoanStatus } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';
import { ILoanHistory } from '@shared/shared/src/types/loan-history';

@Table({ tableName: 'loan_history' })
export class LoanHistory extends Model<ILoanHistory> implements ILoanHistory {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  status: LoanStatus;

  @Column(DataType.STRING)
  cluster: string;

  @Column(DataType.STRING)
  category: string;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
