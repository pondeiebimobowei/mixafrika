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
  HasMany,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { ICollection } from '@shared/shared/src/types/collection';
import { Cluster } from './cluster.model';
import { syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'collection' })
export class Collection extends Model<ICollection> implements ICollection {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.INTEGER)
  declare total_traders: number;

  @Column(DataType.STRING)
  declare about: string;

  @Column(DataType.STRING)
  declare cover_image: string;

  @Column(DataType.DECIMAL(15, 2))
  declare roi: number;

  @Column(DataType.DECIMAL(15, 2))
  declare min_investment: number;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare state: string;

  @Column(DataType.STRING)
  declare country: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } })
  declare sync_status: syncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;

  @HasMany(() => Cluster)
  declare cluster: Cluster

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
