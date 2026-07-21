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
import { SyncStatus, TransferStatus } from '@shared/shared/src/enums';
import { IStockTransfer } from '@shared/shared/src/types/stock-transfer';
import { Branch } from './branch.model';
import { User } from './user.model';

@Table({ tableName: 'stock_transfer' })
export class StockTransfer
  extends Model<IStockTransfer>
  implements IStockTransfer {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.INTEGER)
  declare reason: string;
  
  @Column(DataType.STRING)
  declare status: TransferStatus;



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


    
  @ForeignKey(() => User)
  @Column(DataTypes.UUID)
  declare created_by_id: string;
  
  @ForeignKey(() => Branch)
  @Column(DataTypes.UUID)
  declare from_branch_id: string;

  @ForeignKey(() => Branch)
  @Column(DataTypes.UUID)
  declare to_branch_id: string;

  @BelongsTo(() => User)
  declare created_by?: User;

  @BelongsTo(() => Branch, 'from_branch_id')
  declare from_branch?: Branch;

  @BelongsTo(() => Branch, 'to_branch_id')
  declare to_branch?: Branch;
}
