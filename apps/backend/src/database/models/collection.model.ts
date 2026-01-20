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
import { UserBusiness } from './user-business.model';

@Table({ tableName: 'collection' })
export class Collection extends Model<ICollection> {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare total_traders: string;

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

  @HasMany(() => Cluster)
  declare cluster: Cluster

  @HasMany(() => UserBusiness)
  declare user_businesses: UserBusiness[];

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
