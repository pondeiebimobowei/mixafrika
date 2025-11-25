import { useSavingsState } from '@/store/hooks/savings.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { create_savings_plan, Create_savings_plan } from '@mixafrica/shared/validation/create-savings-plan-dto';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function useCreateSavingsPlan() {
  const [is_loading, set_is_loading ] = useState<boolean>(false);
  const form = useForm<Create_savings_plan>({
    resolver: zodResolver(create_savings_plan),
    defaultValues: {
      auto_save: false,
      is_locked: false,
      maturity_date: null,
      frequency: 'manual',
      interest_rate: '0'

    }
  });
  const { data: { addSaving } } = useSavingsState()

  const handleCreateSavgingsPlan = async (
    data: Create_savings_plan,
  ) => {
    set_is_loading(true);
    addSaving(data);
    set_is_loading(false);

  };

  return {
    form,
    is_loading,
    handleCreateSavgingsPlan,
  };
}
