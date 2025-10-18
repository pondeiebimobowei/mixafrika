import { IUser } from '@shared/shared/src/types/user';
import { Table, Column, Model, DataType, HasOne, HasMany, Validate, CreatedAt, UpdatedAt, DeletedAt, BeforeCreate } from 'sequelize-typescript';
import { Wallet } from './wallet.model';
import { Savings } from './saving.model';
import { Goal } from './goal.model';
import { Investment } from './investment.model';
import { Notification } from './notification.model';
import { Feed } from './feed.model';
import { Roles } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { LoanAccount } from './loan-account.model';

@Table({ 
    tableName: 'user',
    paranoid: true,
})

export class User extends Model<IUser> implements IUser {
  
  
  @Column({ type: DataType.STRING, allowNull: false })
  user_name: string;
  @BeforeCreate({ name: 'user_name' })
  static async generateUsername(user: User) {
    const baseUsername = user.dataValues.first_name.toLowerCase().replace(/\s+/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000);
    user.dataValues.user_name = `${baseUsername}-${randomSuffix}`;
  }

  @Column({ type: DataType.STRING, allowNull: false })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_verified: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_email_verified: boolean;

  @Column({ type: DataType.DECIMAL(5,2), allowNull: false })
  credit_score: number;

  @Column({ type: DataType.STRING, allowNull: false })
  credit_score_status: string;

  @Column({ type: DataType.STRING,  allowNull: false, validate: { isIn: [Object.values(Roles)]} })
  role: Roles;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;


  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt?: Date;

  @HasOne(() => Wallet)
  wallet: Wallet;

  @HasMany(() => Savings)
  savings: Savings[];

  @HasMany(() => Goal)
  goals: Goal[];

  @HasMany(() => LoanAccount)
  loans: LoanAccount[];

  @HasMany(() => Investment)
  investments: Investment[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => Feed)
  feeds: Feed[];
}
