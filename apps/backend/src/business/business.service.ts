import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBusiness, IBusinessWithBranch } from '@shared/shared/src/types/business';
import { Submit_business } from '@shared/shared/src/validation/submit-business-dto';
import { Branch } from 'src/database/models/branch.model';
import { BusinessVerification } from 'src/database/models/business-verification.model';
import { Business } from 'src/database/models/business.model';
import { User } from 'src/database/models/user.model';

@Injectable()
export class BusinessService {

    async handleGetBusiness(user_id: string): Promise<Response<IBusiness[]>> {

        const directBusinesses = await Business.findAll({
            include: [
                {
                    model: User,
                    attributes: [],
                    // where: { user_id: user_id },
                    through: {
                        attributes: ['role']
                    },
                    required: true
                }
            ],
        });

        const branchBusinesses = await Business.findAll({
            include: [
                {
                    model: Branch,
                    required: true,
                    include: [
                        {
                            model: User,
                            // where: { id: user_id },
                            attributes: [],
                            // through: {
                            //     attributes: ['role'],
                            // },
                            required: true,
                        },
                    ],
                },
            ],
        });

        const businessMap = new Map();

        [...directBusinesses, ...branchBusinesses].forEach((b) => {
            businessMap.set(b.id, b);
        });

        const businesses = Array.from(businessMap.values());


        return {
            success: true,
            data: businesses,
            message: 'Business details retrieved successfully'
        }
    }

    async handleSubmitBusiness(user_id: string, { street_address, city, state, country, name, phone, type, cac_document, national_id_document }: Submit_business): Promise<Response<IBusinessWithBranch>> {

        const business = await Business.create({
            city,
            state,
            country,
            street_address,
            name,
            phone,
            type,
        
            is_verified: true,
            sync_status: 'pending',

        })

        await Branch.create({
            business_id: business.id,
            name: business.name,
            phone: business.phone,
            street_address: business.street_address,
            city: business.city,
            state: business.state,
            country: business.country,
            sync_status: 'pending',
            is_head_office: true,
            user_id: user_id,
            
        })

        await BusinessVerification.create({
            business_id: business.id,
            doc_url: cac_document,
            doc_number: '',
            submitted_by: user_id,
            sync_status: 'pending',
            status: 'verified',
            type: '',
            rejection_reason: '',
            reviewed_at: new Date().toDateString(),
            reviewed_by: user_id,

        })

        const businessWithBranch = await Business.findOne({
            where: { id: business.id },
            include: [
                {
                    model: Branch,
                    where: { is_head_office: true },
                    required: true,
                },
            ],
        }) as unknown as IBusinessWithBranch;


        return {
            success: true,
            data: businessWithBranch,
            message: 'Business details submitted successfully!'
        }
    }
}
