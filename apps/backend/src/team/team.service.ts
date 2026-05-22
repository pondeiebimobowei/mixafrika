import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Invites } from 'src/database/models/invites.model';
import { BusinessUser } from 'src/database/models/business-user';
import { BranchUser } from 'src/database/models/branch-user';
import { User } from 'src/database/models/user.model';
import { Business } from 'src/database/models/business.model';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { syncStatus } from '@shared/shared/src/enums';
import { boolean } from 'zod';

@Injectable()
export class TeamService {
  async handleInviteMember(
    invitedBy: string,
    businessId: string,
    data: { email: string; role: string; branch_id?: string },
  ) {
    const business = await Business.findByPk(businessId);
    if (!business) throw new NotFoundException('Business not found');

    // Check if invitation already exists for this email and business
    const existingInvite = await Invites.findOne({
      where: { email: data.email, business_id: businessId }
    });

    if (existingInvite) {
      throw new BadRequestException('An invitation has already been sent to this email');
    }

    const token = uuidv4();
    const expiresAt = dayjs().add(7, 'days').toDate();

    const invitation = await Invites.create({
      email: data.email,
      role: data.role,
      business_id: businessId,
      branch_id: data.branch_id,
      token,
      invited_by: invitedBy,
      expires_at: expiresAt.toISOString(),
      sync_status: syncStatus.PENDING,
      accepted: false,

    });

    console.log(`Invitation created for ${data.email}. Token: ${token}`);

    return {
      success: true,
      message: 'Invitation sent successfully',
      data: invitation,
    };
  }

  async handleGetBranchTeamMembers(branchId: string) {
    const members = await BranchUser.findAll({
      where: { branch_id: branchId },
      include: [{ model: User }],
    });

    return {
      success: true,
      message: 'Branch team members fetched successfully',
      data: members,
    };
  }

  async handleGetBranchPendingInvitations(branchId: string) {
    const invitations = await Invites.findAll({
      where: { branch_id: branchId },
    });

    return {
      success: true,
      message: 'Pending invitations fetched successfully',
      data: invitations,
    };
  }

  async handleAcceptInvitation(token: string, userId: string) {
    const invitation = await Invites.findOne({
      where: { token },
    });

    if (!invitation) throw new NotFoundException('Invitation not found or already processed');

    if (dayjs().isAfter(dayjs(invitation.expires_at))) {
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    // Link user to business
    await BusinessUser.create({
      user_id: userId,
      business_id: invitation.business_id,
      role: invitation.role as any,
      is_active: true,
      has_full_access: false,
      joined_at: new Date().toISOString(),
      sync_status: syncStatus.COMPLETED,
    });

    // Link user to branch if specified
    if (invitation.branch_id) {
      await BranchUser.create({
        user_id: userId,
        branch_id: invitation.branch_id,
        role: invitation.role as any,
        is_active: true,
        assigned_at: new Date().toISOString(),
        sync_status: syncStatus.COMPLETED,
      });
    }

    await invitation.save();

    return {
      success: true,
      message: 'Invitation accepted successfully',
    };
  }

  async handleRemoveMember(businessId: string, userId: string) {
    await BusinessUser.destroy({
      where: { business_id: businessId, user_id: userId },
    });

    return {
      success: true,
      message: 'Member removed successfully',
    };
  }

  async handleCancelInvitation(invitationId: string) {
    const invitation = await Invites.findByPk(invitationId);
    if (!invitation) throw new NotFoundException('Invitation not found');

    await invitation.save();

    return {
      success: true,
      message: 'Invitation cancelled successfully',
    };
  }
}
