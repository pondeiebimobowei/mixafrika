import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  PrimaryKey,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { IUpdate } from '@shared/shared/src/types/update';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'update' })
export class Update extends Model<IUpdate> implements IUpdate {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  category: string;

  @Column(DataType.INTEGER)
  content: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
