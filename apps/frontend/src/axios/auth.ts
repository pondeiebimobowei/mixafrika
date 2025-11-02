import { api } from '.';
import type { Create_user_dto } from '../../../../packages/shared/src/validation/create-user-dto';
import type { Login_user_dto } from '../../../../packages/shared/src/validation/login-user-dto';
import type { AuthResponse } from '@/types/api/responses';

export default function AuthController(){
    const apiSignup = async (data: Create_user_dto): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/signup', data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return { 
                success: false, 
                message: err.response.data.message || 'An error occurred during signup.',
                data: { token: "", refreshToken: "", user: null } 
            };
        } else {
            return { 
                success: false, 
                message: err.message || 'An unexpected network error occurred.',
                data: { token: "", refreshToken: "", user: null } 
            };
        }
    }
}

 const apiLogin = async (data: Login_user_dto): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return { 
                success: false, 
                message: err.response.data.message || 'Invalid credentials or user not found.',
                data: { token: "", refreshToken: "", user: null } 
            };
        } else {
            return { 
                success: false, 
                message: err.message || 'An unexpected network error occurred.',
                data: { token: "", refreshToken: "", user: null } 
            };
        }
    }
}

return { apiLogin, apiSignup }
}
