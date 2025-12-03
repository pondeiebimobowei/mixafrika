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
import { IInvestment } from '@shared/shared/src/types/investment';
import { User } from './user.model';
import { Cluster } from './cluster.model';
import { Status } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'investment' })
export class Investment extends Model<IInvestment> implements IInvestment {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @ForeignKey(() => Cluster)
  @Column
  declare cluster_id: string;

  @Column(DataType.DECIMAL(15, 2))
  declare amount_invested: number;

  @Column(DataType.DECIMAL(15, 2))
  declare total_earnings: number;

  @Column(DataType.STRING)
  declare status: Status;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Cluster)
  declare cluster: Cluster;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
