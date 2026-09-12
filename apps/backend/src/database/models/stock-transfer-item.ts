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
import { IStockTransferItem } from '@mixafrica/shared';
import { StockTransfer } from './stock-transfer.model';
import { Product } from './product.model';

@Table({ tableName: 'stock_transfer_item' })
export class StockTransferItem
  extends Model<IStockTransferItem>
  implements IStockTransferItem {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.INTEGER)
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



  @ForeignKey(() => StockTransfer)
  @Column(DataType.STRING)
  declare transfer_id: string;

  @ForeignKey(() => Product)
  @Column(DataType.STRING)
  declare product_id: string;
}
