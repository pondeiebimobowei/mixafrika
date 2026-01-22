import { Injectable } from '@nestjs/common';
import { User } from 'src/database/models/user.model';
import { UserVerification } from 'src/database/models/user-verification';
import { Verify_identity } from '@shared/shared/src/validation/verify-identity-dto';

@Injectable()
export class UserService {
  async handleGetUserProfile(user_id: string) {
    const user = await User.findOne({
      where: {
        id: user_id,
      },
      include: [UserVerification]
    });

    return {
      success: true,
      message: '',
      data: user,
    };
  }

  async handleUpdateUserProfile() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetCreditScore() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetUsers() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetUsersById() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleVerifyIdentity(
    userId: string,
    data: Verify_identity,
  ) {

    await UserVerification.create({
      ...data,
      user_id: userId,
      status: 'verified',
      rejection_reason: '',
      reviewed_by_id: userId,
      reviewed_at: new Date().toDateString(),
      
      
    })

    return {
      success: true,
      message: 'Identity verification submitted successfully',
    };
  }
}
