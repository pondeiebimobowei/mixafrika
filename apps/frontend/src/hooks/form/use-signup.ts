import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { create_user_dto, type Create_user_dto } from '../../../../../packages/shared/src/validation/create-user-dto'


export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const form = useForm<Create_user_dto>({
    resolver: zodResolver(create_user_dto),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const handleSignup = () => {
    setIsLoading(true);

    // Simulate API call for signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account Created! Please check your email to verify your account.');
      navigate('verify-email')
    }, 1500);
  };

  return {
    form,
    isLoading,
    handleSignup,
  };
}
