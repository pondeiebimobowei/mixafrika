import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

// Define the validation schema locally since it might not be in shared lib yet
const kycSchema = z.object({
    business_name: z.string().min(2, "Business name is required"),
    business_type: z.string().min(1, "Business type is required"),
    business_location: z.string().min(1, "Business location is required"),
    business_phone_number: z.string().min(10, "Valid phone number is required"),
    cac_document: z.any().refine((file) => file, "CAC Document is required"),
    national_id_document: z.any().refine((file) => file, "National ID Document is required"),
});

export type KycFormData = z.infer<typeof kycSchema>;

export function useKyc() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;
    const router = useRouter();

    const form = useForm<KycFormData>({
        resolver: zodResolver(kycSchema),
        defaultValues: {
            business_name: '',
            business_type: '',
            business_location: '',
            business_phone_number: '',
        },
        mode: 'onChange'
    });

    const goNext = async () => {
        let fieldsToValidate: (keyof KycFormData)[] = [];
        if (currentStep === 1) {
            fieldsToValidate = ['business_name', 'business_type', 'business_location', 'business_phone_number'];
        }

        const isStepValid = await form.trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const goBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleKycSubmit = async (data: KycFormData) => {
        setIsLoading(true);
        console.log("Submitting KYC Data:", data);

        // TODO: Integrate with actual backend API
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        Toast.show({
            type: 'success',
            text1: 'KYC Submitted successfully',
            text2: 'Your verification is pending review.'
        });
        router.push('/(protected)/(trader)/(tabs)');
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
