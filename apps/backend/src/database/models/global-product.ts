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
  Unique,
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { SyncStatus, syncStatus } from '@shared/shared/src/enums';
import { IGlobalProduct } from '@shared/shared/src/types/global-product';
import { ProductCategory } from './product-category';

@Table({ tableName: 'global_product' })
export class GlobalProduct
  extends Model<IGlobalProduct> implements IGlobalProduct
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare normalized_name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Unique(true)
  @Column(DataType.STRING)
  declare barcode: string;

  @Column(DataType.STRING)
  declare image_url: string;



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



  @ForeignKey(() => ProductCategory)
  @Column({ type: DataType.UUID, allowNull: true, references: { model: 'product_category', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' })
  declare product_category_id?: string;

  @BelongsTo(() => ProductCategory)
  declare product_category?: ProductCategory;

}
