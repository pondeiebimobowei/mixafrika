import { Table, Column, Model, DataType, ForeignKey, BelongsTo, DeletedAt, UpdatedAt, CreatedAt, PrimaryKey, Default } from 'sequelize-typescript';
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
  user_id: string;

  @ForeignKey(() => Cluster)
  @Column
  cluster_id: string;

  @Column(DataType.DECIMAL(15, 2))
  amount_invested: number;

  @Column(DataType.DECIMAL(15, 2))
  current_value: number;

  @Column(DataType.INTEGER)
  cycle_progress: number;

  @Column(DataType.DATE)
  cycle_ends: Date;

  @Column(DataType.STRING)
  status: Status;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Cluster)
  cluster: Cluster;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
