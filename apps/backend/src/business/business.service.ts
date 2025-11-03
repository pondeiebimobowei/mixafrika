import { Injectable } from '@nestjs/common';
import { UserBusiness } from 'src/database/models/user-business.model';

@Injectable()
export class BusinessService {

    async handleGetUserBusiness(user_id:string){

        await UserBusiness.create( {
            address: 'online',
            name: 'Kelmonde',
            phone: '080333',
            type: 'media',
            user_id,
        })

        await UserBusiness.destroy({ where: { user_id}})
        
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


}
