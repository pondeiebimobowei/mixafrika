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
import { SyncStatus, syncStatus } from '@shared/shared/src/enums';
import { ICustomer } from '@shared/shared/src/types/customer';
import { Branch } from './branch.model';

@Table({ tableName: 'customer' })
export class Customer
  extends Model<ICustomer> implements ICustomer
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare phone?: string;



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
  @Column({ type: DataType.UUID, allowNull: false, references: { model: 'product_category', key: 'id'}, onDelete:'Cascade', onUpdate: 'cascade' })
  declare branch_id: string;

}
