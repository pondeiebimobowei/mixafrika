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
import { IInventory } from '@shared/shared/src/types/inventory';
import { UserBusiness } from './user-business.model';
import { Product } from './product.model';
import { syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'inventory' })
export class Inventory
  extends Model<IInventory> implements IInventory
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => UserBusiness)
  @Column(DataType.STRING)
  declare business_id: string;

  @ForeignKey(() => Product)
  @Column(DataType.STRING)
  declare product_id: string;

  @Column(DataType.STRING)
  declare batch_id: string;

  @Column(DataType.STRING)
  declare quantity: string;

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
