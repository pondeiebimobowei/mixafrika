import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBatch } from '@shared/shared/src/types/batch';
import { Batch } from 'src/database/models/batch.model';

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
        const batch = await Batch.create(batchData as any);
        return {
            success: true,
            data: batch,
            message: 'Batch created successfully'
        };
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
