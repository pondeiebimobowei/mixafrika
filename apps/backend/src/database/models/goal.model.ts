import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default } from 'sequelize-typescript';
import { User } from './user.model';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'goal' })
export class Goal extends Model<Goal> {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.DECIMAL(15, 2))
  currentAmount: number;

  @Column(DataType.DECIMAL(15, 2))
  target: number;

  @Column(DataType.STRING)
  image: string;

  @Column(DataType.DATE)
  targetDate: Date;

  @BelongsTo(() => User)
  user: User;
}
