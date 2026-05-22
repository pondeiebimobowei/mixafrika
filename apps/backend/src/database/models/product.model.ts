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
import { IProduct } from '@shared/shared/src/types/product';
import { SyncStatus, syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'product' })
export class Product
  extends Model<IProduct> implements IProduct
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare bulk_unit_name: string;

  @Column(DataType.STRING)
  declare piece_unit_name: string;

  @Column(DataType.INTEGER)
  declare units_per_bulk: number;

  @Column(DataType.INTEGER)
  declare cost_price_per_unit: number;

  @Column(DataType.INTEGER)
  declare selling_price_per_piece: number;

  @Column(DataType.INTEGER)
  declare selling_price_per_bulk: number;

  @Column(DataType.STRING)
  declare category: string;

  @Column(DataType.STRING)
  declare image_url: string;

  @Column(DataType.STRING)
  declare reviews: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } })
  declare sync_status: SyncStatus;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sync_date: string;
  
  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
