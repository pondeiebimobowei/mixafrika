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
import { SyncStatus } from '@shared/shared/src/enums';
import { IStockAdjustmentItem } from '@shared/shared/src/types/stock-adjustment-item';
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

  @Column(DataType.DECIMAL(15,2))
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
