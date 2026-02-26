import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Verify_identity, verify_identity } from '@mixafrica/shared/validation/verify-identity-dto';
import { verifyIdentity } from '@/axios/user';


export function usePersonalVerification() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<Verify_identity>({
        resolver: zodResolver(verify_identity),
        mode: 'onChange',
    });

    const handleVerificationSubmit = async (data: Verify_identity) => {
        setIsLoading(true);

        const response = await verifyIdentity(data);

        setIsLoading(false);
        if (response && response.success) {
            Toast.show({
                type: 'success',
                text1: 'Verification submitted successfully',
            });
            router.back();
        } else {
            Toast.show({
                type: 'error',
                text1: response.message || 'Verification failed',
            });
        }
    };

    return {
        form,
        isLoading,
        handleVerificationSubmit,
    };
}
