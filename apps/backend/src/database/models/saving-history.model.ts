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
import { Savings } from './saving.model';
import { ISavingsHistory } from '@shared/shared/src/types/savings-history';
import { Types } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'saving_history' })
export class SavingsHistory
  extends Model<ISavingsHistory>
  implements ISavingsHistory
{
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Savings)
  @Column
  savings_id: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  type: Types;

  @BelongsTo(() => Savings)
  savings: Savings;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
