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
import { savingsFrequency, sourceType, SourceType, SavingsFrequency, SavingsType } from '@shared/shared/src/enums';

@Table({ tableName: 'saving' })
export class Savings extends Model<ISaving> implements ISaving {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column
  declare user_id: string;

  @Column(DataType.DECIMAL(15, 2))
  declare total_amount: number;

  @Column(DataType.DATE)
  declare maturity_date: Date | null;

  @Column(DataType.BOOLEAN)
  declare auto_save: boolean;

  @Column(DataType.BOOLEAN)
  declare is_locked: boolean;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare type: SavingsType; 

  @Column(DataType.DECIMAL(15, 2))
  declare target_amount: number;

  @Column(DataType.FLOAT)
  declare interest_rate: number;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(savingsFrequency)]
    }
  })
  declare frequency: SavingsFrequency;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(sourceType)]
    }
  })
  declare source_type: SourceType;

  @Column(DataType.UUID)
  declare source_id: string;

  @HasMany(() => SavingsHistory)
  declare history: SavingsHistory[];

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;
}
