import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { SavingsHistory } from './saving-history.model';
import { User } from './user.model';
import { ISaving } from '@shared/shared/src/types/saving';
import { CreationOptional, DataTypes } from 'sequelize';
import { SavingsType } from '@shared/shared/src/enums';

@Table({ tableName: 'saving' })
export class Savings extends Model<ISaving> implements ISaving {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  total_amount: number;

  @Column(DataType.DATE)
  maturity_date: Date | null;

  @Column(DataType.BOOLEAN)
  auto_save: boolean;

  @Column(DataType.BOOLEAN)
  is_locked: boolean;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  type: SavingsType; 

  @Column(DataType.DECIMAL(15, 2))
  target_amount: number;

  @Column(DataType.FLOAT)
  interest_rate: number;

  @Column(DataType.STRING)
  frequency: string;

  @Column(DataType.STRING)
  source: string;

  @HasMany(() => SavingsHistory)
  history: SavingsHistory[];

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
