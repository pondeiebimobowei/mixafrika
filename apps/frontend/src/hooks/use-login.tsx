import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { login_user_dto, type Login_user_dto } from '../../../../packages/shared/src/validation/login-user-dto';

// import { login_user_dto, type Login_user_dto } from '@mixafrica/shared/src/validation/login-user-dto';
import { useNavigate } from 'react-router';

import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast'
import { zodResolver } from "@hookform/resolvers/zod";

export function useLogin(role: 'investor' | 'trader') {
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  const defaultEmail = role === 'investor' ? 'investor@clustrtrade.com' : 'trader@clustrtrade.com';
  const successRedirect = role === 'investor' ? '/investor' : '/dashboard';

  const form = useForm<Login_user_dto>({
    resolver: zodResolver(login_user_dto),
    defaultValues: {
      email: defaultEmail,
      password: 'password',
    },
  });

  useEffect(() => {
    if (user) {
      navigate(successRedirect);
    }
  }, [user, navigate, successRedirect]);

  const handleLogin = (data: Login_user_dto) => {
    setIsLoading(true);

    setTimeout(() => {
      login(data.email, role);
      setIsLoading(false);
      toast.success('Login Successful');
    }, 1000);
  };

  return {
    form,
    isLoading,
    handleLogin,
  };
}
