import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { roles, type Roles } from '@shared/shared/src/enums';
import { Op } from 'sequelize';
import { Branch } from 'src/database/models/branch.model';
import { BranchUser } from 'src/database/models/branch-user';
import { BusinessUser } from 'src/database/models/business-user';

type BusinessMembership = Pick<BusinessUser, 'business_id' | 'role' | 'has_full_access'>;

@Injectable()
export class TenantAccessService {
  private isManagerRole(role?: Roles) {
    return role === roles.ADMIN || role === roles.SUBADMIN;
  }

  async getAccessibleBusinessIds(userId: string): Promise<string[]> {
    const [businessMemberships, branchMemberships] = await Promise.all([
      BusinessUser.findAll({
        where: { user_id: userId },
        attributes: ['business_id'],
      }),
      BranchUser.findAll({
        where: { user_id: userId },
        attributes: ['branch_id'],
      }),
    ]);

    const branchIds = branchMemberships
      .map((membership) => membership.branch_id)
      .filter(Boolean);

    const branchBusinesses =
      branchIds.length > 0
        ? await Branch.findAll({
            where: { id: { [Op.in]: branchIds } },
            attributes: ['business_id'],
          })
        : [];

    return Array.from(
      new Set([
        ...businessMemberships.map((membership) => membership.business_id),
        ...branchBusinesses.map((branch) => branch.business_id),
      ]),
    );
  }

  async getAccessibleBranchIds(userId: string): Promise<string[]> {
    const [businessMemberships, branchMemberships] = await Promise.all([
      BusinessUser.findAll({
        where: { user_id: userId },
        attributes: ['business_id'],
      }),
      BranchUser.findAll({
        where: { user_id: userId },
        attributes: ['branch_id'],
      }),
    ]);

    const businessIds = businessMemberships
      .map((membership) => membership.business_id)
      .filter(Boolean);

    const businessBranches =
      businessIds.length > 0
        ? await Branch.findAll({
            where: { business_id: { [Op.in]: businessIds } },
            attributes: ['id'],
          })
        : [];

    return Array.from(
      new Set([
        ...branchMemberships.map((membership) => membership.branch_id),
        ...businessBranches.map((branch) => branch.id),
      ]),
    );
  }

  async getBusinessMembership(
    userId: string,
    businessId: string,
  ): Promise<BusinessMembership | null> {
    return BusinessUser.findOne({
      where: { user_id: userId, business_id: businessId },
      attributes: ['business_id', 'role', 'has_full_access'],
    });
  }

  async assertBusinessAccess(userId: string, businessId: string) {
    const businessIds = await this.getAccessibleBusinessIds(userId);

    if (!businessIds.includes(businessId)) {
      throw new ForbiddenException(
        'You do not have access to this business.',
      );
    }
  }

  async assertBusinessManagement(userId: string, businessId: string) {
    const membership = await this.getBusinessMembership(userId, businessId);

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to manage this business.',
      );
    }

    if (
      !membership.has_full_access &&
      !this.isManagerRole(membership.role as Roles)
    ) {
      throw new ForbiddenException(
        'You do not have permission to manage this business.',
      );
    }

    return membership;
  }

  async getBranchOrFail(branchId: string) {
    const branch = await Branch.findByPk(branchId);

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async assertBranchBelongsToBusiness(branchId: string, businessId: string) {
    const branch = await this.getBranchOrFail(branchId);

    if (branch.business_id !== businessId) {
      throw new ForbiddenException(
        'This branch does not belong to the specified business.',
      );
    }

    return branch;
  }

  async assertBranchAccess(userId: string, branchId: string) {
    const branch = await this.getBranchOrFail(branchId);
    const directBusinessMembership = await this.getBusinessMembership(
      userId,
      branch.business_id,
    );

    if (directBusinessMembership) {
      return branch;
    }

    const branchMembership = await BranchUser.findOne({
      where: { user_id: userId, branch_id: branchId },
      attributes: ['id'],
    });

    if (!branchMembership) {
      throw new ForbiddenException('You do not have access to this branch.');
    }

    return branch;
  }
}
