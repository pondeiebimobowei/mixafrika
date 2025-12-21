import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthController from '@/axios/auth';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { create_user_dto, Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const { apiSignup } = AuthController();
  const router = useRouter();

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
      Toast.show({
        type: 'success',
        text1: response.message,
      });
      router.push('/(auth)/login');
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
