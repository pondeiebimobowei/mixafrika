import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { BusinessService } from './business.service';
import { ZodPipe } from 'src/pipes/zod-pipes';
import { Submit_business, submit_business } from '@shared/shared/src/validation/submit-business-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('v1/business')
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get()
    getBusiness(@ParsedToken() user: User) {
        return this.businessService.handleGetBusiness(user.id)
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'cac_document', maxCount: 1 },
        { name: 'national_id_document', maxCount: 1 },
    ]))
    async submitBusiness(
        @ParsedToken() user: User,
        @Body(new ZodPipe(submit_business)) submit_business: Submit_business,
        @UploadedFiles() files: { cac_document?: Express.Multer.File[], national_id_document?: Express.Multer.File[] }
    ) {
        let cac_document_url = '';
        let national_id_document_url = '';

        if (files?.cac_document && files.cac_document.length > 0) {
            const result = await this.cloudinaryService.uploadFile(files.cac_document[0].path);
            cac_document_url = result.secure_url;
        }

        if (files?.national_id_document && files.national_id_document.length > 0) {
            const result = await this.cloudinaryService.uploadFile(files.national_id_document[0].path);
            national_id_document_url = result.secure_url;
        }

        const businessData = {
            ...submit_business,
            cac_document: cac_document_url,
            national_id_document: national_id_document_url
        };

        return this.businessService.handleSubmitBusiness(user.id, businessData)
    }
}
