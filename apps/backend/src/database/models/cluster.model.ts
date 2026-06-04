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
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { ICluster } from '@shared/shared/src/types/cluster';
import { CreationOptional, DataTypes } from 'sequelize';
import { FundingApplication } from './funding_application';
import { Duration, SyncStatus } from '@shared/shared/src/enums';
import { Collection } from './collection.model';

@Table({ tableName: 'cluster' })
export class Cluster extends Model<ICluster> implements ICluster {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare about: string;

  @Column(DataType.STRING)
  declare duration: Duration;

  @Column(DataType.BIGINT)
  declare roi: number;

  @Column(DataType.BIGINT)
  declare total_funds_raised: number;

  @Column(DataType.BIGINT)
  declare target_fundraising_amount: number;

  @Column(DataType.STRING)
  declare repayment: string;

  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  @Column(DataType.STRING)
  declare cover_image: string;

  @Column(DataType.STRING)
  declare start_date: string;

  @Column(DataType.STRING)
  declare end_date: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.DATE)
  declare sync_date: string;

  @Column(DataType.STRING)
  declare sync_status: SyncStatus;


  @HasOne(() => FundingApplication)
  declare application: FundingApplication;

  @BelongsTo(() => Collection)
  declare collection: Collection;

  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  declare collection_id: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
