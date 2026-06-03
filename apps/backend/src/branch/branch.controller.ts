import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from './branch.service';
import { Response } from '@shared/shared/src/types/api/responses';
import { IBranch } from '@shared/shared/src/types/branch';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';

@Controller('v1/branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Get(':business_id')
    async getBranchesByUserId(
        @ParsedToken() user: User,
        @Param('business_id') business_id: string,
    ): Promise<Response<IBranch[]>> {
        return this.branchService.handleGetUserBranches(user.id, business_id);
    }
}
