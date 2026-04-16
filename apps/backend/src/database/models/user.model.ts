import { IUser } from '@shared/shared/src/types/user';
import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  PrimaryKey,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { Wallet } from './wallet.model';
import { Savings } from './saving.model';
import { Goal } from './goal.model';
import { Investment } from './investment.model';
import { Notification } from './notification.model';
import { Feed } from './feed.model';
import { roles, type Roles } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { LoanAccount } from './loan-account.model';
import { UserBusiness } from './user-business.model';
import { Setting } from './setting.model';
import { Transaction } from './transaction.model';
import { FundingApplication } from './funding_application';
import { LoanHistory } from './loan-history.model';
import { BankCard } from './bank-card.model';
import { UserVerification } from './user-verification';
import { Branch } from './branch.model';
import { BusinessUser } from './business-user';

@Table({
  tableName: 'user',
  paranoid: true,
})
export class User extends Model<IUser> implements IUser {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  declare user_name: string;
  @BeforeCreate({ name: 'user_name' })
  static async generateUsername(user: User) {
    const baseUsername = user.dataValues.first_name
      .toLowerCase()
      .replace(/\s+/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000);
    user.dataValues.user_name = `${baseUsername}-${randomSuffix}`;
  }

  @Column({ type: DataType.STRING, allowNull: false })
  declare first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare last_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_email_verified: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_verified: boolean;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  declare credit_score: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare credit_score_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isIn: [Object.values(roles)] },
  })
  declare role: Roles;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;

  @HasOne(() => Wallet)
  declare wallet: Wallet;
  
  @HasOne(() => UserVerification)
  declare verification: UserVerification;

  @HasMany(() => Savings)
  declare savings: Savings[];

  @HasMany(() => BankCard)
  declare bank_cards: BankCard[];

  @HasMany(() => Goal)
  declare goals: Goal[];

  @HasMany(() => LoanAccount)
  declare loan_acount: LoanAccount[];

  @HasMany(() => Transaction)
  declare transaction: Transaction[];

  @HasMany(() => FundingApplication)
  declare application: FundingApplication[];

  @HasMany(() => Investment)
  declare investments: Investment[];

  @HasMany(() => UserBusiness, { foreignKey: 'user_id', as: 'user_business' })
  declare user_business?: UserBusiness;

  @HasMany(() => Branch, { foreignKey: 'user_id', as: 'branch' })
  declare branch?: Branch;

  @HasMany(() => Notification)
  declare notifications: Notification[];

  @HasMany(() => Setting)
  declare setting: Setting;

  @HasMany(() => LoanHistory)
  declare loan_history: LoanHistory;

  @HasMany(() => Feed)
  declare feeds: Feed[];

  @BelongsToMany(() => UserBusiness, () => BusinessUser)
  declare businesses: UserBusiness[];
}
