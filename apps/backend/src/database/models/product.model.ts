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
import { IProduct } from '@shared/shared/src/types/product';
import { SyncStatus, syncStatus } from '@shared/shared/src/enums';
import { Branch } from './branch.model';
import { GlobalProduct } from './global-product';

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

  @Column(DataType.BIGINT)
  declare units_per_bulk: number;

  @Column(DataType.BIGINT)
  declare selling_price_per_piece: number;

  @Column(DataType.BIGINT)
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



  @ForeignKey(() => Branch)
  @Column(DataType.STRING)
  declare branch_id: string;

  @ForeignKey(() => GlobalProduct)
  @Column(DataType.STRING)
  declare global_product_id: string;

  @BelongsTo(() => Branch)
  declare branch?: Branch;

  @BelongsTo(() => GlobalProduct)
  declare global_product?: GlobalProduct;

}
