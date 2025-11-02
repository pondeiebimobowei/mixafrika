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
import { IWallet } from '@shared/shared/src/types/wallet';
import { User } from './user.model';
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

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
