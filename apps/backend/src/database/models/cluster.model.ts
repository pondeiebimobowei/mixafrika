import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  Default,
  PrimaryKey,
  HasOne,
} from 'sequelize-typescript';
import { ICluster } from '@shared/shared/src/types/cluster';
import { CreationOptional, DataTypes } from 'sequelize';
import { FundingApplication } from './funding_application';

@Table({ tableName: 'cluster' })
export class Cluster extends Model<ICluster> implements ICluster {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  category: string;

  @Column(DataType.FLOAT)
  roi: number;

  @Column(DataType.STRING)
  repayment: string;

  @Column(DataType.BOOLEAN)
  is_active: boolean;

  @Column(DataType.STRING)
  description: string;

  @HasOne(() => FundingApplication)
  application: FundingApplication;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
