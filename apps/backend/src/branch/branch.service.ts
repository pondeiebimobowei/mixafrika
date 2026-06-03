import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBranch } from '@shared/shared/src/types/branch';
import { Op } from 'sequelize';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Branch } from 'src/database/models/branch.model';

@Injectable()
export class BranchService {
    constructor(private readonly tenantAccessService: TenantAccessService) {}

    async handleGetUserBranches(user_id: string, business_id: string): Promise<Response<IBranch[]>> {
        await this.tenantAccessService.assertBusinessAccess(user_id, business_id);

        const accessibleBranchIds =
            await this.tenantAccessService.getAccessibleBranchIds(user_id);

        const branches = await Branch.findAll({
            where: {
                business_id,
                id: {
                    [Op.in]: accessibleBranchIds,
                },
            },
        });

        return {
            success: true,
            data: branches,
            message: 'Branches retrieved successfully'
        }
    }
}
