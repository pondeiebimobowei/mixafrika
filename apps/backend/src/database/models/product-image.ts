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
import { IProductImage } from '@mixafrica/shared';
import { SyncStatus, syncStatus } from '@mixafrica/shared';
import { Product } from './product.model';

@Table({ tableName: 'product_image' })
export class ProductImage
  extends Model<IProductImage> implements IProductImage
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare local_path?: string;

  @Column(DataType.STRING)
  declare remote_url?: string;



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



  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  declare product_id: string;

}
