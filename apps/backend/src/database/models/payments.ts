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
  Validate,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { paymentStatus, PaymentStatus, SyncStatus, syncStatus } from '@shared/shared/src/enums';
import { IPayment } from '@shared/shared/src/types/payments';
import { Sales } from './sales.model';

@Table({ tableName: 'payment' })
export class Payment
  extends Model<IPayment> implements IPayment
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.DECIMAL(15,2))
  declare amount: number;

  @Column(DataType.STRING)
  declare reference?: string;

  @Column(DataType.STRING)
  declare payment_method: string;

  @Validate({isIn: [Object.values(paymentStatus)]})
  @Column(DataType.STRING)
  declare status: PaymentStatus;



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



  @ForeignKey(() => Sales)
  @Column(DataType.STRING)
  declare sale_id: string;
}
