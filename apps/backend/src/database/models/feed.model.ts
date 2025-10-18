import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default, DeletedAt, UpdatedAt, CreatedAt } from 'sequelize-typescript';
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
  @Column
  user_id: string;

  @Column(DataType.STRING)
  content: string;

  @Column(DataType.STRING)
  image: string;

  @Column(DataType.INTEGER)
  likes: number;

  @Column(DataType.INTEGER)
  comments: number;

  @Column(DataType.INTEGER)
  shares: number;

  @Column(DataType.INTEGER)
  views: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
