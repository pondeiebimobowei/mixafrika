import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProduct } from '@shared/shared/src/types/product';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@ParsedToken() user: User, @Body() productData: Partial<IProduct>) {
        return this.productService.create(user.id, productData);
    }

    @Get()
    findAll(@ParsedToken() user: User) {
        return this.productService.findAll(user.id);
    }

    @Get(':id')
    findOne(@ParsedToken() user: User, @Param('id') id: string) {
        return this.productService.findOne(user.id, id);
    }

    @Patch(':id')
    update(@ParsedToken() user: User, @Param('id') id: string, @Body() productData: Partial<IProduct>) {
        return this.productService.update(user.id, id, productData);
    }

    @Delete(':id')
    remove(@ParsedToken() user: User, @Param('id') id: string) {
        return this.productService.remove(user.id, id);
    }
}
