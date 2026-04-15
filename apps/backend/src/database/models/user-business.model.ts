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
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { IBusiness } from '@shared/shared/src/types/business';
import { CreationOptional, DataTypes } from 'sequelize';
import { syncStatus } from '@shared/shared/src/enums';
import { User } from './user.model';
import { Branch } from './branch.model';
import { BusinessUser } from './business-user';

@Table({ tableName: 'user_business' })
export class UserBusiness
  extends Model<IBusiness>
  implements IBusiness {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.INTEGER)
  declare phone: string;

  @Column(DataType.STRING)
  declare street_address: string;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare state: string;

  @Column(DataType.STRING)
  declare country: string;

  @Column(DataType.BOOLEAN)
  declare is_verified: boolean;

  @Column(DataType.STRING)
  declare sync_status: syncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare user_id: string;

  @BelongsToMany(() => User, () => BusinessUser)
users: User[];

  @HasMany(() => Branch)
  declare branches: Branch

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
