import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { ISales } from '@shared/shared/src/types/sales';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Sales } from 'src/database/models/sales.model';

@Injectable()
export class SalesService {
    constructor(private readonly tenantAccessService: TenantAccessService) {}

    async findAll(userId: string): Promise<Response<ISales[]>> {
        const branchIds = await this.tenantAccessService.getAccessibleBranchIds(userId);
        const sales = branchIds.length > 0
            ? await Sales.findAll({
                where: {
                    branch_id: {
                        [Op.in]: branchIds,
                    },
                },
                include: ['customer', 'branch']
            })
            : [];
        return {
            success: true,
            data: sales,
            message: 'Sales retrieved successfully'
        };
    }

    async findOne(userId: string, id: string): Promise<Response<ISales | null>> {
        const sale = await Sales.findByPk(id, {
            include: ['customer', 'branch']
        });
        if (!sale) {
            return {
                success: false,
                data: null,
                message: 'Sale not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, sale.branch_id);

        return {
            success: true,
            data: sale,
            message: 'Sale retrieved successfully'
        };
    }

    async create(userId: string, saleData: Partial<ISales>): Promise<Response<ISales>> {
        if (!saleData.branch_id) {
            throw new BadRequestException('branch_id is required');
        }

        await this.tenantAccessService.assertBranchAccess(userId, saleData.branch_id);

        const sale = await Sales.create({
            ...saleData,
            created_by_id: userId,
        } as any);
        return {
            success: true,
            data: sale,
            message: 'Sale created successfully'
        };
    }

    async update(userId: string, id: string, saleData: Partial<ISales>): Promise<Response<ISales | null>> {
        const sale = await Sales.findByPk(id);
        if (!sale) {
            return {
                success: false,
                data: null,
                message: 'Sale not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, sale.branch_id);

        if (saleData.branch_id && saleData.branch_id !== sale.branch_id) {
            await this.tenantAccessService.assertBranchAccess(userId, saleData.branch_id);
        }

        await sale.update(saleData);
        return {
            success: true,
            data: sale,
            message: 'Sale updated successfully'
        };
    }

    async remove(userId: string, id: string): Promise<Response<void>> {
        const sale = await Sales.findByPk(id);
        if (!sale) {
            return {
                success: false,
                data: undefined,
                message: 'Sale not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, sale.branch_id);

        await sale.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Sale deleted successfully'
        };
    }
}
