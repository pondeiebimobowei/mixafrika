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
import { IBatch } from '@shared/shared/src/types/batch';
import { Product } from './product.model';
import { SyncStatus, syncStatus } from '@shared/shared/src/enums';
import { Branch } from './branch.model';

@Table({ tableName: 'batch' })
export class Batch
    extends Model<IBatch> implements IBatch {
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

    @Column(DataType.STRING)
    declare expiry_date: string;

    @Column(DataType.STRING)
    declare batch_number: string;

    @Column(DataType.INTEGER)
    declare cost_price_per_unit: number;

    @Column(DataType.INTEGER)
    declare selling_price_per_piece: number;

    @Column(DataType.INTEGER)
    declare selling_price_per_bulk: number;

    @Column(DataType.INTEGER)
    declare initial_quantity: number;

    @Column(DataType.INTEGER)
    declare remaining_quantity: number;

    @ForeignKey(() => Product)
    @Column(DataType.STRING)
    declare product_id: string;

    @ForeignKey(() => Branch)
    @Column(DataType.STRING)
    declare branch_id: string;

    @BelongsTo(() => Product, 'product_id')
    declare product: Product;

    @BelongsTo(() => Product, 'branch_id')
    declare branch: Product;

    @Column(DataType.INTEGER)
    declare quantity: number;

    @Column({ type: DataType.STRING, allowNull: false, validate: { isIn: [Object.values(syncStatus)] } })
    declare sync_status: SyncStatus;

    @Column({ type: DataType.STRING, allowNull: false })
    declare sync_date: string;



    @CreatedAt
    declare createdAt: string;

    @UpdatedAt
    declare updatedAt: string;

    @DeletedAt
    declare deletedAt?: string;
}
