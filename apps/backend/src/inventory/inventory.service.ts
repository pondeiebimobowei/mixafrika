import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IInventory } from '@shared/shared/src/types/inventory';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Inventory } from 'src/database/models/inventory.model';

@Injectable()
export class InventoryService {
    constructor(private readonly tenantAccessService: TenantAccessService) {}

    async findAll(userId: string): Promise<Response<IInventory[]>> {
        const branchIds = await this.tenantAccessService.getAccessibleBranchIds(userId);
        const inventory = branchIds.length > 0
            ? await Inventory.findAll({
                where: {
                    branch_id: {
                        [Op.in]: branchIds,
                    },
                },
                include: ['product', 'branch', 'batch']
            })
            : [];
        return {
            success: true,
            data: inventory,
            message: 'Inventory retrieved successfully'
        };
    }

    async findOne(userId: string, id: string): Promise<Response<IInventory | null>> {
        const inventory = await Inventory.findByPk(id, {
            include: ['product', 'branch', 'batch']
        });
        if (!inventory) {
            return {
                success: false,
                data: null,
                message: 'Inventory item not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, inventory.branch_id);

        return {
            success: true,
            data: inventory,
            message: 'Inventory item retrieved successfully'
        };
    }

    async create(userId: string, inventoryData: Partial<IInventory>): Promise<Response<IInventory>> {
        if (!inventoryData.branch_id) {
            throw new BadRequestException('branch_id is required');
        }

        await this.tenantAccessService.assertBranchAccess(userId, inventoryData.branch_id);

        const inventory = await Inventory.create(inventoryData as any);
        return {
            success: true,
            data: inventory,
            message: 'Inventory item created successfully'
        };
    }

    async update(userId: string, id: string, inventoryData: Partial<IInventory>): Promise<Response<IInventory | null>> {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return {
                success: false,
                data: null,
                message: 'Inventory item not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, inventory.branch_id);

        if (inventoryData.branch_id && inventoryData.branch_id !== inventory.branch_id) {
            await this.tenantAccessService.assertBranchAccess(userId, inventoryData.branch_id);
        }

        await inventory.update(inventoryData);
        return {
            success: true,
            data: inventory,
            message: 'Inventory item updated successfully'
        };
    }

    async remove(userId: string, id: string): Promise<Response<void>> {
        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return {
                success: false,
                data: undefined,
                message: 'Inventory item not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, inventory.branch_id);

        await inventory.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Inventory item deleted successfully'
        };
    }
}
