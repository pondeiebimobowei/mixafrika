import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { submitBusinessKyc } from '@/axios/business';
import { Submit_business, submit_business } from '@mixafrica/shared/validation/submit-business-dto';


export function useKyc() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;
    const router = useRouter();

    const form = useForm<Submit_business>({
        resolver: zodResolver(submit_business),
        mode: 'onChange'
    });

    const goNext = async () => {
        let fieldsToValidate: (keyof Submit_business)[] = [];
        if (currentStep === 1) {
            fieldsToValidate = ['name', 'type', 'street_address', 'phone', 'city', 'state', 'country'];
        }

        const isStepValid = await form.trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const goBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleKycSubmit = async (data: Submit_business) => {
        setIsLoading(true);
            
        const response = await submitBusinessKyc(data);

        setIsLoading(false);
        if (response && response.success) {
            Toast.show({
                type: 'success',
                text1: response.message,
            });
            router.push('/(protected)/(trader)/(tabs)');
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
        handleKycSubmit,
        currentStep,
        totalSteps,
        goNext,
        goBack
    };
}
