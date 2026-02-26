import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) { }

    getCloudinary() {
        const cloudinaryUploadFolder = this.configService.get('NODE_ENV') === 'production' ? 'prod_mix' : 'dev_mix';
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET')
        })

        return { cloudinary, cloudinaryUploadFolder }
    }

    async uploadFile(file: string) {
        const { cloudinary, cloudinaryUploadFolder } = this.getCloudinary();
        return await cloudinary.uploader.upload(file, { resource_type: 'raw', folder: cloudinaryUploadFolder })
    }


    async uploadFileStream(file: Express.Multer.File): Promise<any> {
        const { cloudinary, cloudinaryUploadFolder } = this.getCloudinary();
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: cloudinaryUploadFolder },
                (error, result) => {
                    console.log(error)
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            uploadStream.end(file.buffer);
        });
    }
}
