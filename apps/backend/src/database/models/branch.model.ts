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
import { CreationOptional, DataTypes } from 'sequelize';
import { SyncStatus } from '@shared/shared/src/enums';
import { IBranch } from '@shared/shared/src/types/branch';
import { Business } from './business.model';
import { User } from './user.model';
import { BranchUser } from './branch-user';
import { Collection } from './collection.model';

@Table({ tableName: 'branch' })
export class Branch
  extends Model<IBranch>
  implements IBranch {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.BOOLEAN)
  declare is_head_office: boolean;

  @Column(DataType.INTEGER)
  declare phone: string;

  @Column(DataType.STRING)
  declare street_address: string;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare state: string;

  @Column(DataType.STRING)
  declare country: string;



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



  @ForeignKey(() => Business)
  @Column(DataType.UUID)
  declare business_id: string;

  @BelongsTo(() => Business)
  declare business: Business[];

  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  declare collection_id?: string;

}
