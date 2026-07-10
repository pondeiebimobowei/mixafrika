import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBatch } from '@shared/shared/src/types/batch';
import { Transaction } from 'sequelize';
import { Inventory } from 'src/database/models/inventory.model';
import { Batch } from 'src/database/models/batch.model';
import { StockMovement } from 'src/database/models/stock-movement';

@Injectable()
export class BatchService {
    async findAll(): Promise<Response<IBatch[]>> {
        const batches = await Batch.findAll({
            include: ['product', 'branch']
        });
        return {
            success: true,
            data: batches,
            message: 'Batches retrieved successfully'
        };
    }

    async findOne(id: string): Promise<Response<IBatch | null>> {
        const batch = await Batch.findByPk(id, {
            include: ['product', 'branch']
        });
        if (!batch) {
            return {
                success: false,
                data: null,
                message: 'Batch not found'
            };
        }
        return {
            success: true,
            data: batch,
            message: 'Batch retrieved successfully'
        };
    }

    async create(batchData: Partial<IBatch>): Promise<Response<IBatch>> {
        const sequelize = Batch.sequelize;
        if (!sequelize) {
            throw new Error('Database connection unavailable');
        }

        const now = new Date().toISOString();
        const initialQuantity = Number(batchData.initial_quantity ?? batchData.remaining_quantity ?? 0);
        const remainingQuantity = Number(batchData.remaining_quantity ?? initialQuantity);

        return sequelize.transaction(async (transaction) => {
            const batch = await Batch.create(
                {
                    ...batchData,
                    batch_number: batchData.batch_number || `BATCH-${Date.now()}`,
                    initial_quantity: initialQuantity,
                    remaining_quantity: remainingQuantity,
                    sync_status: batchData.sync_status ?? 'completed',
                    sync_date: batchData.sync_date ?? now,
                } as any,
                { transaction },
            );

            if (initialQuantity > 0) {
                const existingInventory = await Inventory.findOne({
                    where: {
                        product_id: batch.product_id,
                        branch_id: batch.branch_id,
                    },
                    transaction,
                    lock: Transaction.LOCK.UPDATE,
                });

                if (existingInventory) {
                    await existingInventory.update(
                        {
                            quantity: Number(existingInventory.quantity ?? 0) + initialQuantity,
                            sync_status: batchData.sync_status ?? 'completed',
                            sync_date: batchData.sync_date ?? now,
                        } as any,
                        { transaction },
                    );
                } else {
                    await Inventory.create(
                        {
                            product_id: batch.product_id,
                            branch_id: batch.branch_id,
                            batch_id: batch.id,
                            quantity: initialQuantity,
                            sync_status: batchData.sync_status ?? 'completed',
                            sync_date: batchData.sync_date ?? now,
                        } as any,
                        { transaction },
                    );
                }

                await StockMovement.create(
                    {
                        type: 'purchase',
                        quantity: initialQuantity,
                        product_id: batch.product_id,
                        branch_id: batch.branch_id,
                        batch_id: batch.id,
                        created_by_id: null,
                        reference_id: batch.id,
                        sync_status: batchData.sync_status ?? 'completed',
                        sync_date: batchData.sync_date ?? now,
                    } as any,
                    { transaction },
                );
            }

            const createdBatch = await Batch.findByPk(batch.id, {
                include: ['product', 'branch'],
                transaction,
            });

            return {
                success: true,
                data: createdBatch ?? batch,
                message: 'Batch created successfully',
            };
        });
    }

    async update(id: string, batchData: Partial<IBatch>): Promise<Response<IBatch | null>> {
        const batch = await Batch.findByPk(id);
        if (!batch) {
            return {
                success: false,
                data: null,
                message: 'Batch not found'
            };
        }
        await batch.update(batchData);
        return {
            success: true,
            data: batch,
            message: 'Batch updated successfully'
        };
    }

    async remove(id: string): Promise<Response<void>> {
        const batch = await Batch.findByPk(id);
        if (!batch) {
            return {
                success: false,
                data: undefined,
                message: 'Batch not found'
            };
        }
        await batch.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Batch deleted successfully'
        };
    }
}
