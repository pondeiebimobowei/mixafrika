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
import { ISalesItem } from '@shared/shared/src/types/sales-item';
import { Product } from './product.model';
import { Sales } from './sales.model';
import { syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'sales_item' })
export class SalesItem
    extends Model<ISalesItem> implements ISalesItem {
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

    @ForeignKey(() => Product)
    @Column(DataType.STRING)
    declare product_id: string;

    @Column(DataType.STRING)
    declare quantity: string;

    @Column(DataType.STRING)
    declare unit_price: string;

    @Column(DataType.STRING)
    declare total: string;

    @ForeignKey(() => Sales)
    @Column(DataType.STRING)
    declare sale_id: string;

    @BelongsTo(() => Product, 'product_id')
    declare product: Product;

    @BelongsTo(() => Sales, 'sale_id')
    declare sale: Sales;

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
