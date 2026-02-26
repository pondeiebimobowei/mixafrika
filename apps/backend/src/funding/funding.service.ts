import { HttpException, Injectable } from '@nestjs/common';
import { FundingApplication } from '../database/models/funding_application';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Create_funding_application_dto } from '@shared/shared/src/validation/funding-application.dto';
import { Cluster } from 'src/database/models/cluster.model';
import { LoanAccountService } from 'src/loan_account/loan_account.service';


@Injectable()
export class FundingService {

    constructor ( 
      private readonly cloudinary: CloudinaryService,
      private readonly loanService: LoanAccountService,

     ) {}

  async create( { statement, amount, ...createFundingApplicationDto}: Create_funding_application_dto, userId: string, files: { statement?: Express.Multer.File[] } ) {
    
    const { cloudinary, cloudinaryUploadFolder } = this.cloudinary.getCloudinary()

    const statement_doc = files.statement ? files.statement[0].path : null;

    if( !statement_doc ) {
      throw new HttpException({ success: false, message: "Missing required document: statement"}, 500 );
    }
    
    let result = await cloudinary.uploader.upload(statement_doc, { resource_type: 'raw', folder: cloudinaryUploadFolder })
    const image_url = result.secure_url

    const data =  await FundingApplication.create({
      ...createFundingApplicationDto,
      user_business_id: createFundingApplicationDto.user_business_id,
      duration: Number(createFundingApplicationDto.duration),
      amount: Number(amount),
      allocated_amount: Number(amount),
      statement_of_account_doc: image_url,
      user_id: userId,
    });

    this.approveFunding(userId, String(data.id), String(data.duration))
    
    // if (fs.existsSync(statement_doc)) {
    //       fs.unlinkSync(statement_doc);
    //  }

    return {
      success: true,
      data,
      message: "Application Successful"
    }
  }

  async approveFunding ( user_id: string, application_id: string, duration: string ) {

    const cluster = await Cluster.findOne({ where: { duration }})

    await FundingApplication.update( { cluster_id: cluster?.id, approved_at: new Date().toISOString() }, { where: {  id: application_id }})

    const { data } = await this.loanService.handleCreate(user_id, application_id )

    return {
      success: true,
      data,
      message: 'Successfully approved!'

    }
  }
}
