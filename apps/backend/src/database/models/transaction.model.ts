import { Table, Column, Model, DataType, ForeignKey, BelongsTo, DeletedAt, UpdatedAt, CreatedAt, PrimaryKey, Default } from 'sequelize-typescript';
import { ITransaction } from '@shared/shared/src/types/transaction';
import { Types } from '@shared/shared/src/enums';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';

@Table({ tableName: 'transaction' })
export class Transaction extends Model<ITransaction> implements ITransaction {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;
  
  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column(DataType.STRING)
  type: Types;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.DECIMAL(15, 2))
  amount: number;

  @Column(DataType.STRING)
  category: string;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
