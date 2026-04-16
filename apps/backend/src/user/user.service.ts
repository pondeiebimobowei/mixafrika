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
    const users = await User.findAll();
    return {
      success: true,
      message: 'Users found successfully!',
      data: users,
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
      reviewed_by: userId,
      id_image_front_url: '',
      id_image_back_url: '',
      type: '',
      id_number: '',
      submitted_at: new Date().toDateString(),
      createdAt: new Date().toDateString(),

      
      reviewed_at: new Date().toDateString(),
      
      
    })

    return {
      success: true,
      message: 'Identity verification submitted successfully',
    };
  }
}
