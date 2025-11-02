import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.model';
import { IUserBusiness } from '@shared/shared/src/types/user-business';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'user_business' })
export class UserBusiness
  extends Model<IUserBusiness>
  implements IUserBusiness
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  declare user_id: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.INTEGER)
  phone: string;

  @Column(DataType.INTEGER)
  address: string;

  @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
  declare user?: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
