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
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';
import { ISetting } from '@shared/shared/src/types/setting';

@Table({ tableName: 'setting' })
export class Setting extends Model<ISetting> implements ISetting {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.BOOLEAN)
  enable_dark_mode: boolean;

  @Column(DataType.BOOLEAN)
  enable_email_notification: boolean;

  @Column(DataType.BOOLEAN)
  enable_push_notification: boolean;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
