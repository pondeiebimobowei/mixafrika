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
import { Cluster } from './cluster.model';
import { UserBusiness } from './user-business.model';

@Table({ tableName: 'funding_application' })
export class FundingApplication
  extends Model<IFundingApplication>
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  declare user_id: string;

  @ForeignKey(() => Cluster)
  @Column(DataType.STRING)
  declare cluster_id: string | null;

  @ForeignKey(() => UserBusiness)
  @Column(DataType.STRING)
  declare user_business_id: string;

  @Column(DataType.DECIMAL(15, 2))
  declare amount: number;

  @Column(DataType.DECIMAL(15, 2))
  declare allocated_amount: number;

  @Column(DataType.INTEGER)
  declare duration: number;

  @Column(DataType.STRING)
  declare repayment_plan: string;

  @Column(DataType.STRING)
  declare purpose: string;

  @Column(DataType.STRING)
  declare statement_of_account_doc: string | null;

  @Column(DataType.DATE)
  declare approved_at: string;

  @BelongsTo(() => Cluster)
  declare cluster?: Cluster;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
