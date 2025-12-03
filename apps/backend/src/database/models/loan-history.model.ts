import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  PrimaryKey,
  Default,
  HasMany,
  BelongsTo,
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
  declare user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  declare amount: number;

  @Column(DataType.STRING)
  declare status: LoanStatus;

  @Column(DataType.UUID)
  declare cluster_id: string;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
