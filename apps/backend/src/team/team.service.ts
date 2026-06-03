import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Invites } from 'src/database/models/invites.model';
import { BusinessUser } from 'src/database/models/business-user';
import { BranchUser } from 'src/database/models/branch-user';
import { Branch } from 'src/database/models/branch.model';
import { User } from 'src/database/models/user.model';
import { Business } from 'src/database/models/business.model';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { syncStatus } from '@shared/shared/src/enums';
import { TenantAccessService } from 'src/access/tenant-access.service';
import { Op } from 'sequelize';

@Injectable()
export class TeamService {
  constructor(private readonly tenantAccessService: TenantAccessService) {}

  async handleInviteMember(
    invitedBy: string,
    businessId: string,
    data: { email: string; role: string; branch_id?: string },
  ) {
    await this.tenantAccessService.assertBusinessManagement(invitedBy, businessId);

    const business = await Business.findByPk(businessId);
    if (!business) throw new NotFoundException('Business not found');

    if (data.branch_id) {
      await this.tenantAccessService.assertBranchBelongsToBusiness(
        data.branch_id,
        businessId,
      );
    }

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

  async handleGetBranchTeamMembers(requestUserId: string, branchId: string) {
    await this.tenantAccessService.assertBranchAccess(requestUserId, branchId);

    const members = await BranchUser.findAll({
      where: { branch_id: branchId },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });

    return {
      success: true,
      message: 'Branch team members fetched successfully',
      data: members,
    };
  }

  async handleGetBranchPendingInvitations(requestUserId: string, branchId: string) {
    await this.tenantAccessService.assertBranchAccess(requestUserId, branchId);

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
    if (invitation.accepted) throw new BadRequestException('Invitation has already been accepted');

    if (dayjs().isAfter(dayjs(invitation.expires_at))) {
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.email !== invitation.email) {
      throw new ForbiddenException('This invitation does not belong to the authenticated user');
    }

    // Link user to business
    const existingBusinessMembership = await BusinessUser.findOne({
      where: { user_id: userId, business_id: invitation.business_id },
    });

    if (!existingBusinessMembership) {
      await BusinessUser.create({
        user_id: userId,
        business_id: invitation.business_id,
        role: invitation.role as any,
        is_active: true,
        has_full_access: false,
        joined_at: new Date().toISOString(),
        sync_status: syncStatus.COMPLETED,
      });
    }

    // Link user to branch if specified
    if (invitation.branch_id) {
      const existingBranchMembership = await BranchUser.findOne({
        where: { user_id: userId, branch_id: invitation.branch_id },
      });

      if (!existingBranchMembership) {
        await BranchUser.create({
          user_id: userId,
          branch_id: invitation.branch_id,
          role: invitation.role as any,
          is_active: true,
          assigned_at: new Date().toISOString(),
          sync_status: syncStatus.COMPLETED,
        });
      }
    }

    invitation.accepted = true;
    await invitation.save();

    return {
      success: true,
      message: 'Invitation accepted successfully',
    };
  }

  async handleRemoveMember(requestUserId: string, businessId: string, userId: string) {
    await this.tenantAccessService.assertBusinessManagement(requestUserId, businessId);

    await BusinessUser.destroy({
      where: { business_id: businessId, user_id: userId },
    });

    const businessBranches = await Branch.findAll({
      where: { business_id: businessId },
      attributes: ['id'],
    });

    if (businessBranches.length > 0) {
      await BranchUser.destroy({
        where: {
          user_id: userId,
          branch_id: {
            [Op.in]: businessBranches.map((branch) => branch.id),
          },
        },
      });
    }

    return {
      success: true,
      message: 'Member removed successfully',
    };
  }

  async handleCancelInvitation(requestUserId: string, invitationId: string) {
    const invitation = await Invites.findByPk(invitationId);
    if (!invitation) throw new NotFoundException('Invitation not found');

    await this.tenantAccessService.assertBusinessManagement(
      requestUserId,
      invitation.business_id,
    );

    await invitation.destroy();

    return {
      success: true,
      message: 'Invitation cancelled successfully',
    };
  }
}
