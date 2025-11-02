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
import { User } from './user.model';
import { INotification } from '@shared/shared/src/types/notification';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'notification' })
export class Notification
  extends Model<INotification>
  implements INotification
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.TEXT)
  message: string;

  @Column(DataType.BOOLEAN)
  read: boolean;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
