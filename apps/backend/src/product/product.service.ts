import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IProduct } from '@shared/shared/src/types/product';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { GlobalProduct } from 'src/database/models/global-product';
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
                include: [GlobalProduct],
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
            data: await Product.findByPk(id, { include: [GlobalProduct] }) ?? product,
            message: 'Product retrieved successfully'
        };
    }

    async create(userId: string, productData: Partial<IProduct>): Promise<Response<IProduct>> {
        if (!productData.branch_id) {
            throw new BadRequestException('branch_id is required');
        }

        await this.tenantAccessService.assertBranchAccess(userId, productData.branch_id);

        const normalizedName = String(productData.name ?? '').toLowerCase().trim().replace(/\s+/g, ' ');
        const barcode = String((productData as any).barcode ?? '').trim();
        const effectiveBarcode = barcode || normalizedName;
        const productCategoryId = (productData as any).category_id ?? (productData as any).product_category_id;
        const globalProductId = productData.global_product_id ?? (await this.resolveGlobalProductId({
          globalProductId: productData.global_product_id,
          name: productData.name,
          description: productData.description,
          barcode,
          effectiveBarcode,
          imageUrl: (productData as any).image_url,
          productCategoryId,
        }));

        const product = await Product.create({
          ...productData,
          global_product_id: globalProductId,
        } as any);
        return {
            success: true,
            data: product,
            message: 'Product created successfully'
        };
    }

    async update(userId: string, id: string, productData: Partial<IProduct>): Promise<Response<IProduct | null>> {
        const product = await Product.findByPk(id, { include: [GlobalProduct] });
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

        const nextGlobalProductId = await this.resolveGlobalProductId({
          globalProductId: product.global_product_id,
          name: productData.name ?? product.name,
          description: productData.description ?? product.description,
          barcode: (productData as any).barcode ?? product.global_product?.barcode,
          imageUrl: (productData as any).image_url ?? product.global_product?.image_url,
          productCategoryId: (productData as any).category_id ?? (productData as any).product_category_id ?? product.global_product?.product_category_id,
        });

        if (product.global_product) {
          await product.global_product.update({
            name: productData.name ?? product.global_product.name,
            normalized_name: (productData.name ?? product.global_product.name).toLowerCase().trim().replace(/\s+/g, ' '),
            description: productData.description ?? product.global_product.description,
            barcode: (productData as any).barcode ?? product.global_product.barcode,
            image_url: (productData as any).image_url ?? product.global_product.image_url,
            product_category_id: (productData as any).category_id ?? (productData as any).product_category_id ?? product.global_product.product_category_id,
          } as any);
        }

        await product.update({
          ...productData,
          global_product_id: nextGlobalProductId,
        } as any);
        return {
            success: true,
            data: await Product.findByPk(id, { include: [GlobalProduct] }) ?? product,
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

    private async resolveGlobalProductId({
      globalProductId,
      name,
      description,
      barcode,
      effectiveBarcode,
      imageUrl,
      productCategoryId,
    }: {
      globalProductId?: string;
      name?: string;
      description?: string;
      barcode?: string;
      effectiveBarcode?: string;
      imageUrl?: string;
      productCategoryId?: string;
    }) {
      if (globalProductId) {
        return globalProductId;
      }

      if (!name) {
        throw new BadRequestException('name is required');
      }

      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, ' ');
      const lookupConditions: Array<Record<string, string>> = [{ normalized_name: normalizedName }];

      if (barcode) {
        lookupConditions.push({ barcode });
      }

      const existing = await GlobalProduct.findOne({
        where: {
          [Op.or]: lookupConditions,
        } as any,
      });

      if (existing) {
        return existing.id;
      }

      const created = await GlobalProduct.create({
        name,
        normalized_name: normalizedName,
        description: description ?? '',
        barcode: effectiveBarcode ?? normalizedName,
        image_url: imageUrl ?? '',
        product_category_id: productCategoryId ?? null,
        sync_status: 'completed',
        sync_date: new Date().toISOString(),
      } as any);

      return created.id;
    }
}
