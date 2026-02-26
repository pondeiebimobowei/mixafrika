import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthController from '@/axios/auth';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { create_user_dto, Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import { useAuthStore } from '@/store';
import { Roles } from '@mixafrica/shared/enums';

export function useSignup(role: Roles | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { apiSignup } = AuthController();
  const router = useRouter();
  const { login } = useAuthStore();
  

  const form = useForm<Create_user_dto>({
    resolver: zodResolver(create_user_dto),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    },
  });

  const handleSignup = async (data: Create_user_dto) => {
    setIsLoading(true);

    const response = await apiSignup(data);

    setIsLoading(false);

    if (response.success) {
      login({...response.data, current_role: role });

      Toast.show({
        type: 'success',
        text1: response.message,
      });
      router.push('/(protected)/(trader)/kyc');
    } else {
      Toast.show({
        type: 'error',
        text1: response.message,
      });
    }
  };

  return {
    form,
    isLoading,
    handleSignup,
  };
}
