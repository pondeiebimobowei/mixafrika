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
import { IStockAdjustment } from '@shared/shared/src/types/stock-adjustment';
import { Branch } from './branch.model';
import { User } from './user.model';

@Table({ tableName: 'stock_adjustment' })
export class StockAdjustment
  extends Model<IStockAdjustment>
  implements IStockAdjustment {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.TEXT)
  declare reason: string;



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



  @ForeignKey(() => Branch)
  @Column(DataType.UUID)
  declare branch_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare created_by_id: string;

  

}
