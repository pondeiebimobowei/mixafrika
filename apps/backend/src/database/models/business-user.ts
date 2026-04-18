import { IUser } from '@shared/shared/src/types/user';
import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { roles, syncStatus, type Roles } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { IBusinessUser } from '@shared/shared/src/types/business-user';
import { User } from './user.model';
import { Business } from './business.model';

@Table({
  tableName: 'business_user',
  paranoid: true,
})
export class BusinessUser extends Model<IBusinessUser> implements IBusinessUser {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isIn: [Object.values(roles)] },
  })
  declare role: Roles;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_active: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare has_full_access: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare joined_at?: string;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;


  @ForeignKey(() => Business)
  @Column(DataType.UUID)
  declare business_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sync_status: syncStatus;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;


}
