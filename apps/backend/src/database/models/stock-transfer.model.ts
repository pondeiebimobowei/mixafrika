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
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { syncStatus } from '@shared/shared/src/enums';
import { IStockTransfer } from '@shared/shared/src/types/stock-transfer';

@Table({ tableName: 'stock_transfer' })
export class StockTransfer
  extends Model<IStockTransfer>
  implements IStockTransfer {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare from_branch_id: string;

  @Column(DataType.STRING)
  declare to_branch_id: string;

  @Column(DataType.INTEGER)
  declare reason: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare created_by: string;

  @Column(DataType.STRING)
  declare sync_status: syncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
