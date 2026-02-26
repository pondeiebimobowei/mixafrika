import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { IFeed } from '@shared/shared/src/types/feed';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'feed' })
export class Feed extends Model<IFeed> implements IFeed {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  declare user_id: string;

  @Column(DataType.STRING)
  declare content: string;

  @Column(DataType.STRING)
  declare image_url: string;

  @Column(DataType.INTEGER)
  declare likes: number;

  @Column(DataType.INTEGER)
  declare comments: number;

  @Column(DataType.INTEGER)
  declare shares: number;

  @Column(DataType.INTEGER)
  declare views: number;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
