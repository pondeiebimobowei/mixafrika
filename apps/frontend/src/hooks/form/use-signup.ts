import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { create_user_dto, type Create_user_dto } from '../../../../../packages/shared/src/validation/create-user-dto'
import AuthController from '@/axios/auth';


export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const { apiSignup } = AuthController()
  

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

  const handleSignup = async( data: Create_user_dto) => {
    setIsLoading(true);

    const response = await apiSignup(data);
    
    setIsLoading(false);

    if (response.success) {
      toast.success(response.message);
      navigate('/verify-email');
    } else {
       toast.error(response.message);
    
  };
};

  return {
    form,
    isLoading,
    handleSignup,
  };
}
