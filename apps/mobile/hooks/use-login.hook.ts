import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import AuthController from '../axios/auth';
import { Roles } from '@mixafrica/shared/enums';

import { useAuthStore } from '@/store';
import Toast from 'react-native-toast-message';
import { login_user_dto, Login_user_dto } from '@mixafrica/shared/validation/login-user-dto';

export function useLogin(role: Roles) {
  const [isLoading, setIsLoading] = useState(false);
  const { apiLogin } = AuthController();

  const { login } = useAuthStore();
  const router = useRouter();

  const form = useForm<Login_user_dto>({
    resolver: zodResolver(login_user_dto),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: Login_user_dto) => {
    setIsLoading(true);
    const response = await apiLogin(data);
    setIsLoading(false);

    if (response.success) {
      login({...response.data, current_role: role });
      Toast.show({
        type: 'success',
        text1: response.message,
      });

      switch(role){
        case 'investor':
          router.push('/(protected)/(investor)/(tabs)');
          break;
        case 'trader':
          router.push('/(protected)/(trader)/(tabs)');
          break;
      }
    } else {
      Toast.show({
        type: 'success',
        text1: response.message,
      });
    }
  };

  return {
    form,
    isLoading,
    handleLogin,
  };
}
