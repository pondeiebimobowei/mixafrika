import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { SyncStatus, VerificationStatus, verificationStatus } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { IBusinessVerification } from '@shared/shared/src/types/business-verification';
import { Business } from './business.model';
import { User } from './user.model';

@Table({
  tableName: 'business_verification',
  paranoid: true,
})
export class BusinessVerification extends Model<IBusinessVerification> implements IBusinessVerification {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare type: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare doc_number?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare doc_url: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(verificationStatus)] } })
  declare status: VerificationStatus;

  @Column({ type: DataType.STRING, allowNull: false })
  declare rejection_reason: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reviewed_at: string;



  @Column({ type: DataType.DATE, allowNull: true })
  declare sync_date?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare sync_status: SyncStatus;


  
  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;



  @ForeignKey(() => Business)
  @Column({ type: DataType.UUID, allowNull: false })
  declare business_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare submitted_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare reviewed_by: string;

  @BelongsTo(() => Business)
  declare business: Business;

  @BelongsTo(() => User, 'submitted_by')
  declare submittedByUser?: User;

  @BelongsTo(() => User, 'reviewed_by')
  declare reviewedByUser?: User;

}
