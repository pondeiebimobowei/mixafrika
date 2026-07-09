import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AdminOverview, AdminModerationAction } from '../admin.types';
import { User } from 'src/database/models/user.model';
import { Business } from 'src/database/models/business.model';
import { UserVerification } from 'src/database/models/user-verification';
import { BusinessVerification } from 'src/database/models/business-verification.model';
import { Branch } from 'src/database/models/branch.model';
import { Customer } from 'src/database/models/customer';
import { Collection } from 'src/database/models/collection.model';

@Injectable()
export class AdminDashboardService {
  async handleGetOverview(): Promise<{ success: boolean; message: string; data: AdminOverview }> {
    const [
      totalUsers,
      verifiedUsers,
      pendingUserVerifications,
      unverifiedUsers,
      totalBusinesses,
      verifiedBusinesses,
      pendingBusinessVerifications,
      totalBranches,
      totalCustomers,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { is_verified: true } }),
      UserVerification.count({ where: { status: 'pending' } }),
      User.count({ where: { is_verified: false } }),
      Business.count(),
      Business.count({ where: { is_verified: true } }),
      BusinessVerification.count({ where: { status: 'pending' } }),
      Branch.count(),
      Customer.count(),
    ]);

    return {
      success: true,
      message: 'Admin overview retrieved successfully',
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          pendingVerification: pendingUserVerifications,
          unverified: unverifiedUsers,
        },
        businesses: {
          total: totalBusinesses,
          verified: verifiedBusinesses,
          pendingVerification: pendingBusinessVerifications,
        },
        activity: {
          pendingUserVerifications,
          pendingBusinessVerifications,
          totalBranches,
          totalCustomers,
        },
      },
    };
  }

  async handleGetUsers() {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      include: [UserVerification],
    });

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  async handleGetUserById(id: string) {
    const user = await User.findByPk(id, {
      include: [UserVerification],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async handleGetBusinesses() {
    const businesses = await Business.findAll({
      order: [['createdAt', 'DESC']],
      include: [Branch, BusinessVerification],
    });

    return {
      success: true,
      message: 'Businesses retrieved successfully',
      data: businesses,
    };
  }

  async handleGetUserVerifications() {
    const verifications = await UserVerification.findAll({
      order: [['createdAt', 'DESC']],
      include: [User],
    });

    return {
      success: true,
      message: 'User verifications retrieved successfully',
      data: verifications,
    };
  }

  async handleGetBusinessVerifications() {
    const verifications = await BusinessVerification.findAll({
      order: [['createdAt', 'DESC']],
      include: [Business],
    });

    return {
      success: true,
      message: 'Business verifications retrieved successfully',
      data: verifications,
    };
  }

  async handleReviewUserVerification(
    verificationId: string,
    action: AdminModerationAction,
  ) {
    const verification = await UserVerification.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundException('User verification not found');
    }

    await verification.update({
      status: action.status,
      reviewed_by: action.reviewed_by,
      reviewed_at: action.reviewed_at,
      rejection_reason: action.rejection_reason ?? verification.rejection_reason,
    });

    await User.update(
      {
        is_verified: action.status === 'verified',
      },
      { where: { id: verification.user_id } },
    );

    return {
      success: true,
      message: 'User verification updated successfully',
      data: verification,
    };
  }

  async handleReviewBusinessVerification(
    verificationId: string,
    action: AdminModerationAction,
  ) {
    const verification = await BusinessVerification.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundException('Business verification not found');
    }

    await verification.update({
      status: action.status,
      reviewed_by: action.reviewed_by,
      reviewed_at: action.reviewed_at,
      rejection_reason: action.rejection_reason ?? verification.rejection_reason,
    });

    await Business.update(
      {
        is_verified: action.status === 'verified',
      },
      { where: { id: verification.business_id } },
    );

    return {
      success: true,
      message: 'Business verification updated successfully',
      data: verification,
    };
  }

  async handleGetCollections() {
    const collections = await Collection.findAll({
      order: [['createdAt', 'DESC']],
      limit: 25,
    });

    return {
      success: true,
      message: 'Collections retrieved successfully',
      data: collections,
    };
  }
}
