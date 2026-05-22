import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from './branch.service';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBranch } from '@shared/shared/src/types/branch';

@Controller('v1/branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Get(':business_id')
    async getBranchesByUserId(@Param('business_id') business_id: string): Promise<Response<IBranch[]>> {
        return this.branchService.handleGetUserBranches(business_id);
    }
}
