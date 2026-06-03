import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBusiness, IBusinessWithBranch } from '@shared/shared/src/types/business';
import { Submit_business } from '@shared/shared/src/validation/submit-business-dto';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Branch } from 'src/database/models/branch.model';
import { BusinessUser } from 'src/database/models/business-user';
import { BusinessVerification } from 'src/database/models/business-verification.model';
import { Business } from 'src/database/models/business.model';

@Injectable()
export class BusinessService {
    constructor(private readonly tenantAccessService: TenantAccessService) {}

    async handleGetBusiness(user_id: string): Promise<Response<IBusiness[]>> {
        const businessIds =
            await this.tenantAccessService.getAccessibleBusinessIds(user_id);
        const businesses =
            businessIds.length > 0
                ? await Business.findAll({
                    where: {
                        id: {
                            [Op.in]: businessIds,
                        },
                    },
                })
                : [];


        return {
            success: true,
            data: businesses,
            message: 'Business details retrieved successfully'
        }
    }

    async handleSubmitBusiness(user_id: string, { street_address, city, state, country, name, phone, type, cac_document, national_id_document }: Submit_business): Promise<Response<IBusinessWithBranch>> {
        const now =  new Date().toDateString();

        const business = await Business.create({
            city,
            state,
            country,
            street_address,
            name,
            phone,
            type,
        
            is_verified: true,
            sync_status: 'completed',
            sync_date: now,
            

        })

        await Branch.create({
            business_id: business.id,
            name: business.name,
            phone: business.phone,
            street_address: business.street_address,
            city: business.city,
            state: business.state,
            country: business.country,
            sync_status: 'completed',
            sync_date: now,
            is_head_office: true,            
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
            reviewed_at: now,
            reviewed_by: user_id,

        })

        await BusinessUser.create({
            business_id: business.id,
            user_id: user_id,
            role: 'admin',
            sync_status: 'completed',
            sync_date: now,
            has_full_access: true,
            is_active: false,
            joined_at: now,
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
