import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IInvites } from '@shared/shared/src/types/invites';
import { CreationOptional, DataTypes } from 'sequelize';
import { SyncStatus } from '@shared/shared/src/enums';
import { Business } from './business.model';
import { Branch } from './branch.model';
import { User } from './user.model';

@Table({ tableName: 'invites' })
export class Invites
  extends Model<IInvites>
  implements IInvites {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare role: string;

  @Column(DataType.STRING)
  declare token: string;

  @Column(DataType.BOOLEAN)
  declare accepted: boolean;

  @Column(DataType.DATE)
  declare expires_at: string;



  @Column(DataType.STRING)
  declare sync_status: SyncStatus;

  @Column(DataType.DATE)
  declare sync_date?: string;



  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;

  @DeletedAt
  declare deletedAt?: string;



  @ForeignKey(() => Branch)
  @Column({ type: DataType.UUID, allowNull: true })
  declare branch_id: string;

  @ForeignKey(() => Business)
  @Column(DataType.UUID)
  declare business_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare invited_by: string;

  @BelongsTo(() => Business)
  declare business: Business;

  @BelongsTo(() => Branch)
  declare branch: Branch;

  @BelongsTo(() => User, 'invited_by')
  declare invitee: User;

}
