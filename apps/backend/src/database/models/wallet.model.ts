import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, PrimaryKey, Default, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { IWallet } from '@shared/shared/src/types/wallet';
import { User } from './user.model';
import { Transaction } from './transaction.model';
import { CreationOptional, DataTypes } from 'sequelize';

@Table({ tableName: 'wallet' })

export class Wallet extends Model<IWallet> implements IWallet {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;
  
  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  total_portfolio: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;
}
