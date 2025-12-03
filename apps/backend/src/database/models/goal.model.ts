import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { CreationOptional, DataTypes } from 'sequelize';
import { IGoal } from '@shared/shared/src/types/goal';

@Table({ tableName: 'goal' })
export class Goal extends Model<IGoal> {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.DECIMAL(15, 2))
  declare current_amount: number;

  @Column(DataType.DECIMAL(15, 2))
  declare target: number;

  @Column(DataType.STRING)
  declare image: string;

  @Column(DataType.DATE)
  declare target_date: Date;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
  
}
