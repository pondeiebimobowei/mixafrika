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
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { syncStatus } from '@shared/shared/src/enums';
import { IBranch } from '@shared/shared/src/types/branch';
import { UserBusiness } from './user-business.model';
import { User } from './user.model';

@Table({ tableName: 'branch' })
export class Branch
  extends Model<IBranch>
  implements IBranch {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.BOOLEAN)
  declare is_head_office: boolean;
  
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

  
  @Column(DataType.STRING)
  declare sync_status: syncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;

  @ForeignKey(() => UserBusiness)
  @Column(DataType.UUID)
  declare user_business_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare user_id: string;
  
  @BelongsTo(() => User)
  declare user: User;
  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
