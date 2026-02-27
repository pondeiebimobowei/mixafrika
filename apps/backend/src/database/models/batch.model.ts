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
import { syncStatus } from '@shared/shared/src/enums';

@Table({ tableName: 'batch' })
export class Batch
    extends Model<IBatch> implements IBatch {
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.UUID)
    declare id: CreationOptional<string>;

    @ForeignKey(() => Product)
    @Column(DataType.STRING)
    declare product_id: string;

    @BelongsTo(() => Product, 'product_id')
    declare product: Product;

    @Column(DataType.STRING)
    declare expiry_date: string;

    @Column(DataType.INTEGER)
    declare quantity: number;

    @Column(DataType.STRING)
    declare batch_number: string;

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
