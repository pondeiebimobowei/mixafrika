import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { ISalesItem } from '@shared/shared/src/types/sales-item';
import { SalesItem } from 'src/database/models/sales-item.model';

@Injectable()
export class SalesItemService {
    async findAll(): Promise<Response<ISalesItem[]>> {
        const salesItems = await SalesItem.findAll({
            include: ['product', 'sale']
        });
        return {
            success: true,
            data: salesItems,
            message: 'Sales items retrieved successfully'
        };
    }

    async findOne(id: string): Promise<Response<ISalesItem | null>> {
        const salesItem = await SalesItem.findByPk(id, {
            include: ['product', 'sale']
        });
        if (!salesItem) {
            return {
                success: false,
                data: null,
                message: 'Sales item not found'
            };
        }
        return {
            success: true,
            data: salesItem,
            message: 'Sales item retrieved successfully'
        };
    }

    async create(salesItemData: Partial<ISalesItem>): Promise<Response<ISalesItem>> {
        const salesItem = await SalesItem.create(salesItemData as any);
        return {
            success: true,
            data: salesItem,
            message: 'Sales item created successfully'
        };
    }

    async update(id: string, salesItemData: Partial<ISalesItem>): Promise<Response<ISalesItem | null>> {
        const salesItem = await SalesItem.findByPk(id);
        if (!salesItem) {
            return {
                success: false,
                data: null,
                message: 'Sales item not found'
            };
        }
        await salesItem.update(salesItemData);
        return {
            success: true,
            data: salesItem,
            message: 'Sales item updated successfully'
        };
    }

    async remove(id: string): Promise<Response<void>> {
        const salesItem = await SalesItem.findByPk(id);
        if (!salesItem) {
            return {
                success: false,
                data: undefined,
                message: 'Sales item not found'
            };
        }
        await salesItem.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Sales item deleted successfully'
        };
    }
}
