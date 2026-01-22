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
import { VerificationStatus } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { IBusinessVerification } from '@shared/shared/src/types/business-verification';
import { UserBusiness } from './user-business.model';

@Table({
  tableName: 'business_verification',
  paranoid: true,
})
export class BusinessVerification extends Model<IBusinessVerification> implements IBusinessVerification {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => UserBusiness)
  @Column({ type: DataType.UUID, allowNull: false })
  declare business_id: string;
  
  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(VerificationStatus)] } })
  declare status: VerificationStatus;

  @Column({ type: DataType.STRING, allowNull: false })
  declare cac_document: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare rejection_reason: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reviewed_by_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reviewed_at: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;

  @BelongsTo(() => UserBusiness)
  declare business: UserBusiness;
  
}
