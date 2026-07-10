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
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { SyncStatus } from '@shared/shared/src/enums';
import { IStockMovement } from '@shared/shared/src/types/stock-movement';
import { Product } from './product.model';
import { Branch } from './branch.model';
import { Batch } from './batch.model';
import { User } from './user.model';

@Table({ tableName: 'stock_movement' })
export class StockMovement
  extends Model<IStockMovement>
  implements IStockMovement {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.BIGINT)
  declare quantity: number;

  @Column(DataType.STRING)
  declare reference_id?: string;

  @Column(DataType.TEXT)
  declare note?: string;



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



  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  declare product_id: string;

  @ForeignKey(() => Branch)
  @Column(DataType.UUID)
  declare branch_id: string;

  @ForeignKey(() => Batch)
  @Column(DataType.UUID)
  declare batch_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare created_by_id: string;

  @BelongsTo(() => Product)
  declare product?: Product;

  @BelongsTo(() => Branch)
  declare branch?: Branch;

  @BelongsTo(() => Batch)
  declare batch?: Batch;

  @BelongsTo(() => User)
  declare created_by?: User;



}
