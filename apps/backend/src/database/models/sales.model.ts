import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    DeletedAt,
    UpdatedAt,
    CreatedAt,
    PrimaryKey,
    Default,
    BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional, DataTypes } from 'sequelize';
import { User } from './user.model';
import { ISales } from '@shared/shared/src/types/sales';
import { UserBusiness } from './user-business.model';
import { SalesStatus, syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'sales' })
export class Sales
    extends Model<ISales> implements ISales {
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

    @ForeignKey(() => UserBusiness)
    @Column(DataType.STRING)
    declare branch_id: string;

    @ForeignKey(() => User)
    @Column(DataType.STRING)
    declare customer_id: string;

    @Column(DataType.INTEGER)
    declare total_amount: number;

    @Column(DataType.STRING)
    declare payment_method: string;

    @Column(DataType.STRING)
    declare status: SalesStatus;

    @Column(DataType.INTEGER)
    declare amount_paid: number;

    @Column(DataType.INTEGER)
    declare balance: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare created_by_id: string;

    @BelongsTo(() => UserBusiness, 'branch_id')
    declare branch: UserBusiness;

    @BelongsTo(() => User, 'customer_id')
    declare customer: User;

    @BelongsTo(() => User, 'created_by_id')
    declare created_by: User;

    @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } })
    declare syncStatus: syncStatus;

    @Column({ type: DataType.STRING, allowNull: false })
    declare syncDate: string;



    @CreatedAt
    declare createdAt: string;

    @UpdatedAt
    declare updatedAt: string;

    @DeletedAt
    declare deletedAt?: string;
}
