import { submitFundingApplication } from '@/axios/funding';
import { zodResolver } from '@hookform/resolvers/zod';
import { create_funding_application_dto, Create_funding_application_dto } from '@mixafrica/shared/validation/funding-application.dto';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function useFundApplication() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<Create_funding_application_dto>({
    resolver: zodResolver(create_funding_application_dto),
  });
  const router = useRouter()

  const handleFundingApplication = async (
    data: Create_funding_application_dto,
  ) => {
    setIsLoading(true);
    const response = await submitFundingApplication(data);
    setIsLoading(false);

    if (response.success) {
      Toast.show({
        type: 'success',
        text1: response.message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: response.message,
      });
    }
    router.back()
  };

  return {
    form,
    isLoading,
    handleFundingApplication,
  };
}
