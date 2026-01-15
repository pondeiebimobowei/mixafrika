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
  implements IUserBusiness {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
  declare user_id: string;

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

  @Column(DataType.STRING)
  declare cac_document: string;

  @Column(DataType.STRING)
  declare national_id_document: string;

  @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
  declare user?: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
