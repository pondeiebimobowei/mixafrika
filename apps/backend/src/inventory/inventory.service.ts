import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IInventory } from '@shared/shared/src/types/inventory';
import { Inventory } from 'src/database/models/inventory.model';

@Injectable()
export class InventoryService {
    async findAll(): Promise<Response<IInventory[]>> {
        const inventory = await Inventory.findAll({
            include: ['product', 'business', 'batch']
        });
        return {
            success: true,
            data: inventory,
            message: 'Inventory retrieved successfully'
        };
    }

    async findOne(id: string): Promise<Response<IInventory | null>> {
        const inventory = await Inventory.findByPk(id, {
            include: ['product', 'business', 'batch']
        });
        if (!inventory) {
            return {
                success: false,
                data: null,
                message: 'Inventory item not found'
            };
        }
        return {
            success: true,
            data: inventory,
            message: 'Inventory item retrieved successfully'
        };
    }

    async create(inventoryData: Partial<IInventory>): Promise<Response<IInventory>> {
        const inventory = await Inventory.create(inventoryData as any);
        return {
            success: true,
            data: inventory,
            message: 'Inventory item created successfully'
        };
    }

    async update(id: string, inventoryData: Partial<IInventory>): Promise<Response<IInventory | null>> {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return {
                success: false,
                data: null,
                message: 'Inventory item not found'
            };
        }
        await inventory.update(inventoryData);
        return {
            success: true,
            data: inventory,
            message: 'Inventory item updated successfully'
        };
    }

    async remove(id: string): Promise<Response<void>> {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return {
                success: false,
                data: undefined,
                message: 'Inventory item not found'
            };
        }
        await inventory.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Inventory item deleted successfully'
        };
    }
}
