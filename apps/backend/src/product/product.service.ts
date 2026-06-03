import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IProduct } from '@shared/shared/src/types/product';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Product } from 'src/database/models/product.model';

@Injectable()
export class ProductService {
    constructor(private readonly tenantAccessService: TenantAccessService) {}

    async findAll(userId: string): Promise<Response<IProduct[]>> {
        const branchIds = await this.tenantAccessService.getAccessibleBranchIds(userId);
        const products = branchIds.length > 0
            ? await Product.findAll({
                where: {
                    branch_id: {
                        [Op.in]: branchIds,
                    },
                },
            })
            : [];
        return {
            success: true,
            data: products,
            message: 'Products retrieved successfully'
        };
    }

    async findOne(userId: string, id: string): Promise<Response<IProduct | null>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, product.branch_id);

        return {
            success: true,
            data: product,
            message: 'Product retrieved successfully'
        };
    }

    async create(userId: string, productData: Partial<IProduct>): Promise<Response<IProduct>> {
        if (!productData.branch_id) {
            throw new BadRequestException('branch_id is required');
        }

        await this.tenantAccessService.assertBranchAccess(userId, productData.branch_id);

        const product = await Product.create(productData as any);
        return {
            success: true,
            data: product,
            message: 'Product created successfully'
        };
    }

    async update(userId: string, id: string, productData: Partial<IProduct>): Promise<Response<IProduct | null>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, product.branch_id);

        if (productData.branch_id && productData.branch_id !== product.branch_id) {
            await this.tenantAccessService.assertBranchAccess(userId, productData.branch_id);
        }

        await product.update(productData);
        return {
            success: true,
            data: product,
            message: 'Product updated successfully'
        };
    }

    async remove(userId: string, id: string): Promise<Response<void>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: undefined,
                message: 'Product not found'
            };
        }

        await this.tenantAccessService.assertBranchAccess(userId, product.branch_id);

        await product.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Product deleted successfully'
        };
    }
}
