import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeamService } from './team.service';
import { User } from 'src/database/models/user.model';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';

@Controller('v1/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('invite/:businessId')
  inviteMember(
    @ParsedToken() user: User,
    @Param('businessId') businessId: string,
    @Body() data: { email: string; role: string; branch_id?: string },
  ) {
    return this.teamService.handleInviteMember(user.id, businessId, data);
  }

  @Get('branch/members/:branchId')
  getBranchTeamMembers(
    @ParsedToken() user: User,
    @Param('branchId') branchId: string,
  ) {
    return this.teamService.handleGetBranchTeamMembers(user.id, branchId);
  }

  @Get('branch/invites/:branchId')
  getBranchPendingInvitations(
    @ParsedToken() user: User,
    @Param('branchId') branchId: string,
  ) {
    return this.teamService.handleGetBranchPendingInvitations(user.id, branchId);
  }

  @Post('accept-invite')
  acceptInvitation(
    @ParsedToken() user: User,
    @Body('token') token: string,
  ) {
    return this.teamService.handleAcceptInvitation(token, user.id);
  }

  @Delete('members/:businessId/:userId')
  removeMember(
    @ParsedToken() user: User,
    @Param('businessId') businessId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.handleRemoveMember(user.id, businessId, userId);
  }

  @Delete('invitations/:invitationId')
  cancelInvitation(
    @ParsedToken() user: User,
    @Param('invitationId') invitationId: string,
  ) {
    return this.teamService.handleCancelInvitation(user.id, invitationId);
  }
}
