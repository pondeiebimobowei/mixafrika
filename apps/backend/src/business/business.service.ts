import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IUserBusiness } from '@shared/shared/src/types/user-business';
import { Submit_business } from '@shared/shared/src/validation/submit-business-dto';
import { BusinessVerification } from 'src/database/models/business-verification.model';
import { UserBusiness } from 'src/database/models/user-business.model';

@Injectable()
export class BusinessService {

    async handleGetUserBusiness(user_id: string): Promise<Response<IUserBusiness[]>> {


        const business = await UserBusiness.findAll({
            where: {
                user_id
            },
            include: [BusinessVerification]
        })

        return {
            success: true,
            data: business,
            message: 'Business details retrieved successfully'
        }
    }

    async handleSubmitUserBusiness(user_id: string, { street_address, city, state, country, name, phone, type, cac_document, national_id_document }: Submit_business): Promise<Response<IUserBusiness>> {


        const business = await UserBusiness.create({
            city, state, country, street_address, name, phone, type, user_id
        })

        await BusinessVerification.create({
            business_id: business.id,
            cac_document,
            status: 'verified',
            rejection_reason: '',
            reviewed_at: new Date().toDateString(),
            reviewed_by_id: user_id,

        })

        return {
            success: true,
            data: business,
            message: 'Business details submitted successfully!'
        }
    }
}
