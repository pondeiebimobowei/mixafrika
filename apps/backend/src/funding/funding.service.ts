import { Injectable } from '@nestjs/common';
import { FundingApplication } from '../database/models/funding_application';
import { CreateFundingApplicationDto } from '@shared/shared/src/validation/funding-application.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import fs  from 'fs'


@Injectable()
export class FundingService {

    constructor ( private readonly cloudinary: CloudinaryService ) {}

  async create( { statement, amount, ...createFundingApplicationDto}: CreateFundingApplicationDto, userId: string, files: { statement?: Express.Multer.File[] } ) {
    
    const { cloudinary, cloudinaryUploadFolder } = this.cloudinary.getCloudinary()

    const statement_doc = files.statement ? files.statement[0].path : null;
    
    if( !statement_doc ) {
      throw new Error("Missing required document: statement");
    }
    
    let result = await cloudinary.uploader.upload(statement_doc, { folder: cloudinaryUploadFolder })
    const image_url = result.secure_url
    

    const data =  await FundingApplication.create({
      ...createFundingApplicationDto,
      amount: Number(amount),
      statement_of_account_doc: image_url,
      user_id: userId,
    });
    
    // if (fs.existsSync(statement_doc)) {
    //       fs.unlinkSync(statement_doc);
    //  }

    return {
      success: true,
      data,
      message: "Application Successful"
    }
  }
}
