import { Create_user_dto } from "@mixafrica/shared/validation/create-user-dto";
import { Login_user_dto } from "@mixafrica/shared/validation/login-user-dto";
import { api } from "./axios-config";
import { AuthResponse } from "@mixafrica/shared/types/api/responses";

export default function AuthController() {
  const apiSignup = async (data: Create_user_dto): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signup', data);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      if (err.response) {
        return {
          success: false,
          message:
            err.response.data.message || 'An error occurred during signup.',
          data: { token: '', refreshToken: '', user: null },
        };
      } else {
        return {
          success: false,
          message: err.message || 'An unexpected network error occurred.',
          data: { token: '', refreshToken: '', user: null },
        };
      }
    }
  };

  const apiLogin = async (data: Login_user_dto): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (err: any) {
      if (err.response) {
        return {
          success: false,
          message:
            err.response.data.message ||
            'Invalid credentials or user not found.',
          data: { token: '', refreshToken: '', user: null },
        };
      } else {
        return {
          success: false,
          message: err.message || 'An unexpected network error occurred.',
          data: { token: '', refreshToken: '', user: null },
        };
      }
    }
  };

  return { apiLogin, apiSignup };
}
