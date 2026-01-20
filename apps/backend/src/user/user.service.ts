import { Injectable } from '@nestjs/common';
import { User } from 'src/database/models/user.model';

@Injectable()
export class UserService {
  async handleGetUserProfile(user_id: string) {
    const user = await User.findOne({
      where: {
        id: user_id,
      },
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
}
