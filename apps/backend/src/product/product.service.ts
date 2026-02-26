import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IProduct } from '@shared/shared/src/types/product';
import { Product } from 'src/database/models/product.model';

@Injectable()
export class ProductService {
    async findAll(): Promise<Response<IProduct[]>> {
        const products = await Product.findAll();
        return {
            success: true,
            data: products,
            message: 'Products retrieved successfully'
        };
    }

    async findOne(id: string): Promise<Response<IProduct | null>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }
        return {
            success: true,
            data: product,
            message: 'Product retrieved successfully'
        };
    }

    async create(productData: Partial<IProduct>): Promise<Response<IProduct>> {
        const product = await Product.create(productData as any);
        return {
            success: true,
            data: product,
            message: 'Product created successfully'
        };
    }

    async update(id: string, productData: Partial<IProduct>): Promise<Response<IProduct | null>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: null,
                message: 'Product not found'
            };
        }
        await product.update(productData);
        return {
            success: true,
            data: product,
            message: 'Product updated successfully'
        };
    }

    async remove(id: string): Promise<Response<void>> {
        const product = await Product.findByPk(id);
        if (!product) {
            return {
                success: false,
                data: undefined,
                message: 'Product not found'
            };
        }
        await product.destroy();
        return {
            success: true,
            data: undefined,
            message: 'Product deleted successfully'
        };
    }
}
