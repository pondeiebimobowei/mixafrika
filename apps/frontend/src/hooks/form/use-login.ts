import { useState } from 'react';
import { useAuthStore } from '@/store';
import { login_user_dto, type Login_user_dto } from '../../../../../packages/shared/src/validation/login-user-dto.js';
import { type Roles } from '../../../../../packages/shared/src/enums/index.js';

import { useNavigate } from 'react-router';

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import AuthController from '@/axios/auth';
import toast from 'react-hot-toast';

export function useLogin(role: Roles) {
  const [isLoading, setIsLoading] = useState(false);
  const { apiLogin } = AuthController()
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  const defaultEmail = role === 'investor' ? 'investor@clustrtrade.com' : 'trader@clustrtrade.com';

  const form = useForm<Login_user_dto>({
    resolver: zodResolver(login_user_dto),
    defaultValues: {
      email: defaultEmail,
      password: 'password',
    },
  });

  const handleLogin = async(data: Login_user_dto) => {
    setIsLoading(true);

    const response = await apiLogin(data);

    setIsLoading(false);


    if (response.success) {
      toast.success(`Welcome back, ${user?.first_name}!`);
      login(response.data);
      
        let successRedirect = '/';
        switch (user?.role) {
            case 'investor':
                successRedirect = '/investor/dashboard';
                break;
            case 'trader':
                successRedirect = '/trader/dashboard';
                break;
            case 'admin':
                successRedirect = '/admin/dashboard';
                break;
            case 'agent':
                successRedirect = '/agent/dashboard';
                break;
            default:
                successRedirect = '/login';
                break;
        }
        navigate(successRedirect);

    } else {
      toast.error(response.message);
    }
  };

  return {
    form,
    isLoading,
    handleLogin,
  };
}
