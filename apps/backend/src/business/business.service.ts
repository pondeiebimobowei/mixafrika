import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IUserBusiness } from '@shared/shared/src/types/user-business';
import { Submit_business } from '@shared/shared/src/validation/submit-business-dto';
import { UserBusiness } from 'src/database/models/user-business.model';

@Injectable()
export class BusinessService {

    async handleGetUserBusiness(user_id:string): Promise<Response<IUserBusiness | null>>{


        const business = await UserBusiness.findOne( {
            where: {
                user_id
            }
        })

        return {
            success: true,
            data: business,
            message: 'Business details retrieved successfully'
        }
    }
    
    async handleSubmitUserBusiness(user_id:string, { address, name, phone, type }: Submit_business): Promise<Response<IUserBusiness>> {

        const business = await UserBusiness.create( {
            address, name, phone, type, user_id,
        })

        return {
            success: true,
            data: business,
            message: 'Business details submitted successfully!'
        }
    }
}
