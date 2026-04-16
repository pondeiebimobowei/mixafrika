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
  BelongsToMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Wallet } from './wallet.model';
import { roles, syncStatus, type Roles } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { IBusinessUser } from '@shared/shared/src/types/business-user';
import { User } from './user.model';
import { UserBusiness } from './user-business.model';

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

  @ForeignKey(() => UserBusiness)
  @Column
  declare business_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sync_status: syncStatus;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;

  // @HasOne(() => Wallet)
  // declare wallet: Wallet;
  
  // @HasMany(() => BusinessUser)
  // declare notifications: Notification[];

  // @BelongsToMany(() => UserBusiness, () => User)
  // businesses: UserBusiness[];

  
  // @BelongsTo(() => User)
  // declare user: UserBusiness[];

  // @BelongsTo(() => UserBusiness)
  // declare business: UserBusiness[];

//   @BelongsToMany(() => User, () => BusinessUser)
// users: User[];

}
