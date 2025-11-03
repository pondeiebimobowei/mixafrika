import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Submit_business, submit_business } from '../../../../../packages/shared/src/validation/submit-business-dto';
import { useUserBusiness } from '@/store';

interface Props {
    onSuccess: () => void;
}

export function useBusiness({ onSuccess }: Props) {
    const { updateUserBusiness } = useUserBusiness();

    const form = useForm<Submit_business>({
        resolver: zodResolver(submit_business),
    });

    const handleFormSubmit = (data: Submit_business) => {
        updateUserBusiness(data);
        onSuccess();
    };

    return {
        form,
        handleFormSubmit,
    };
}
