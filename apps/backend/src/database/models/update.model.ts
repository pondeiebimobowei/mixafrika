import {
  Table,
  Column,
  Model,
  DataType,
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
  declare title: string;

  @Column(DataType.STRING)
  declare category: string;

  @Column(DataType.INTEGER)
  declare content: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
