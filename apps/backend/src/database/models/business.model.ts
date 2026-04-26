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
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { IBusiness } from '@shared/shared/src/types/business';
import { CreationOptional, DataTypes } from 'sequelize';
import { syncStatus } from '@shared/shared/src/enums';
import { User } from './user.model';
import { Branch } from './branch.model';
import { BusinessUser } from './business-user';
import { BusinessVerification } from './business-verification.model';

@Table({ tableName: 'business' })
export class Business
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

  // @BelongsTo(() => User)
  // declare user: User;

  // @ForeignKey(() => BusinessUser)
  // @Column(DataType.UUID)
  // declare business_user_id: string;

  

  @BelongsToMany(() => User, () => BusinessUser)
  users: User[];

  @HasOne(() => BusinessVerification)
  declare verification: BusinessVerification;

  // @BelongsTo(() => BusinessUser)
  // declare business_user: BusinessUser;

  @HasMany(() => Branch)
  declare branches: Branch

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
