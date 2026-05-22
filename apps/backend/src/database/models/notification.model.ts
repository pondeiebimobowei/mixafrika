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
  Validate,
} from 'sequelize-typescript';
import { User } from './user.model';
import { INotification } from '@shared/shared/src/types/notification';
import { CreationOptional, DataTypes } from 'sequelize';
import { NotificationType, notificationType } from '@shared/shared/src/enums';

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
  declare user_id: string;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.TEXT)
  declare message: string;

  @Column(DataType.BOOLEAN)
  declare read: boolean;

  @Validate({ isIn: [Object.values(notificationType)]})
  @Column(DataType.STRING)
  declare type: NotificationType;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
