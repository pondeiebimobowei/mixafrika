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
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Wallet } from './wallet.model';
import { roles, syncStatus, type Roles } from '@shared/shared/src/enums';
import { CreationOptional } from 'sequelize';
import { User } from './user.model';
import { IBranchUser } from '@shared/shared/src/types/branch-user';
import { Branch } from './branch.model';

@Table({
  tableName: 'branch_user',
  paranoid: true,
})
export class BranchUser extends Model<IBranchUser> implements IBranchUser {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isIn: [Object.values(roles)] },
  })
  declare role: Roles;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_active: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare assigned_at?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sync_status: syncStatus;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;

  @HasOne(() => Wallet)
  declare wallet: Wallet;

  @HasMany(() => User)
  declare user_id: string;

  @HasMany(() => Branch)
  declare branch_id: string;

}
