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
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';
import { ISales } from '@shared/shared/src/types/sales';
import { UserBusiness } from './user-business.model';
import { syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'sales' })
export class Sales
  extends Model<ISales> implements ISales
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => UserBusiness)
  @Column(DataType.STRING)
  declare branch_id: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  declare customer_id: string;

  @Column(DataType.STRING)
  declare total_amount: string;

  @Column(DataType.STRING)
  declare payment_method: string;

  @Column(DataType.STRING)
  declare status: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare created_by_id: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } })
  declare syncStatus: syncStatus;

  @Column({ type: DataType.STRING, allowNull: false })
  declare syncDate: string;


  
  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
