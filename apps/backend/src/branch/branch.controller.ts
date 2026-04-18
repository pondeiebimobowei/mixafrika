import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from './branch.service';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBranch } from '@shared/shared/src/types/branch';

@Controller('v1/branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Get(':user_id')
    async getBranchesByUserId(@Param('user_id') user_id: string): Promise<Response<IBranch[]>> {
        return this.branchService.handleGetUserBranches(user_id);
    }
}
