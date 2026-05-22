import { Injectable } from '@nestjs/common';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBranch } from '@shared/shared/src/types/branch';
import { Branch } from 'src/database/models/branch.model';

@Injectable()
export class BranchService {

    async handleGetUserBranches(business_id: string): Promise<Response<IBranch[]>> {

        const branches = await Branch.findAll({
            where: { business_id },
        });

        return {
            success: true,
            data: branches,
            message: 'Branches retrieved successfully'
        }
    }
}
