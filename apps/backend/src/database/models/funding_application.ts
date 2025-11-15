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
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';
import { IFundingApplication } from '@shared/shared/src/types/funding-application';

@Table({ tableName: 'funding_application' })
export class FundingApplication
  extends Model<IFundingApplication>
  implements IFundingApplication
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.STRING)
  business_type: string;

  @Column(DataType.STRING)
  business_location: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  duration: string;

  @Column(DataType.STRING)
  repayment_plan: string;

  @Column(DataType.STRING)
  purpose: string;

  @Column(DataType.STRING)
  statement_of_account_doc: string | null;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
