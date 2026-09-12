import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  PrimaryKey,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { SyncStatus } from '@mixafrica/shared';
import { IStockAdjustmentItem } from '@mixafrica/shared';
import { Product } from './product.model';
import { StockAdjustment } from './stock-adjustment';

@Table({ tableName: 'stock_adjustment_item' })
export class StockAdjustmentItem
  extends Model<IStockAdjustmentItem>
  implements IStockAdjustmentItem {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.BIGINT)
  declare quantity: number;



  @Column(DataType.STRING)
  declare sync_status: SyncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;



  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;



  @ForeignKey(() => StockAdjustment)
  @Column(DataType.UUID)
  declare adjustment_id: string;

  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  declare product_id: string;



}
