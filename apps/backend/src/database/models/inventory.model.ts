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
import { IInventory } from '@shared/shared/src/types/inventory';
import { Product } from './product.model';
import { Batch } from './batch.model';
import { syncStatus, SyncStatus } from '@shared/shared/src/enums';
import { Branch } from './branch.model';

@Table({ tableName: 'inventory' })
export class Inventory
    extends Model<IInventory> implements IInventory {
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

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



    @ForeignKey(() => Product)
    @Column(DataType.STRING)
    declare product_id: string;

    @ForeignKey(() => Branch)
    @Column(DataType.STRING)
    declare branch_id: string;

    @ForeignKey(() => Batch)
    @Column(DataType.STRING)
    declare batch_id: string;

    @BelongsTo(() => Product, 'product_id')
    declare product: Product;

    @BelongsTo(() => Branch, 'branch_id')
    declare branch: Branch;

    @BelongsTo(() => Batch, 'batch_id')
    declare batch: Batch;

}
