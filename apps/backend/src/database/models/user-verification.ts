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
import { IUserVerification } from '@shared/shared/src/types/user-verification';
import { User } from './user.model';

@Table({
  tableName: 'user_verification',
  paranoid: true,
})
export class UserVerification extends Model<IUserVerification> implements IUserVerification {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;
  
  @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(VerificationStatus)] } })
  declare status: VerificationStatus;

  @Column({ type: DataType.STRING, allowNull: false })
  declare id_type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare id_number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare id_image_front: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare id_image_back: string;

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

  @BelongsTo(() => User)
  declare user: User;

}
