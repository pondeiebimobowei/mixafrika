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
  Validate,
} from 'sequelize-typescript';
import { IBankCard } from '@shared/shared/src/types/bank-cards';
import { User } from './user.model';
import { CreationOptional, DataTypes } from 'sequelize';
import { cardType, CardType } from '@shared/shared/src/enums';

@Table({ tableName: 'bank_card' })
export class BankCard extends Model<IBankCard> implements IBankCard {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare payment_token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare last_four_digits: string;

  @Validate({ isIn: [Object.values(cardType)]})
  @Column({ type: DataType.STRING, allowNull: false })
  declare card_type: CardType;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_active: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_default: boolean;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
