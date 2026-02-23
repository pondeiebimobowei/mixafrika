import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { ISales } from '@shared/shared/src/types/sales';
import { Sales } from 'src/database/models/sales.model';

@Injectable()
export class SalesService {
    async findAll(): Promise<Response<ISales[]>> {
        const sales = await Sales.findAll({
            include: ['customer', 'branch', 'created_by']
        });
        return {
            success: true,
            data: sales,
            message: 'Sales retrieved successfully'
        };
    }

    async findOne(id: string): Promise<Response<ISales | null>> {
        const sale = await Sales.findByPk(id, {
            include: ['customer', 'branch', 'created_by']
        });
        if (!sale) {
            return {
                success: false,
                data: null,
                message: 'Sale not found'
            };
        }
        return {
            success: true,
            data: sale,
            message: 'Sale retrieved successfully'
        };
    }

    async create(saleData: Partial<ISales>): Promise<Response<ISales>> {
        const sale = await Sales.create(saleData as any);
        return {
            success: true,
            data: sale,
            message: 'Sale created successfully'
        };
    }

    async update(id: string, saleData: Partial<ISales>): Promise<Response<ISales | null>> {
        const sale = await Sales.findByPk(id);
        if (!sale) {
            return {
                success: false,
                data: null,
                message: 'Sale not found'
            };
        }
        await sale.update(saleData);
        return {
            success: true,
            data: sale,
            message: 'Sale updated successfully'
        };
    }

    async remove(id: string): Promise<Response<void>> {
        const sale = await Sales.findByPk(id);
        if (!sale) {
            return {
                success: false,
                data: undefined,
                message: 'Sale not found'
            };
        }
        await sale.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Sale deleted successfully'
        };
    }
}
