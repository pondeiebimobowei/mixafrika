import { createSavingsPlan, getSavingsPlans } from '@/axios/savings';
import { Response } from '@mixafrica/shared/types/api/responses';
import { ISaving } from '@mixafrica/shared/types/saving';
import { Create_savings_plan } from '@mixafrica/shared/validation/create-savings-plan-dto';
import Toast from 'react-native-toast-message';
import { type StateCreator } from 'zustand';


export interface SavingsSlice {
  loading: boolean,
  error: string | null,

  savings: ISaving[];
  completedSavings: ISaving[];
  getSavings: () => void;
  addSaving: (savings: Create_savings_plan) => void;
}

export const createSavingsSlice: StateCreator<
  SavingsSlice,
  [['zustand/immer', never]],
  [],
  SavingsSlice
> = (set) => ({
  loading: false,
  error: null,

  savings: [],
  completedSavings: [],
  getSavings: async () => {
    set({ loading: true})

    const { success, data, message } = await getSavingsPlans();
    set({ savings: data, loading: false })

  },
  addSaving: async (savings) => {
    set({ loading: true})

    const {success, message, data } = await createSavingsPlan(savings)
    if(success){

        set((state) => {
            state.savings = [...state.savings, Object(data)]
        })

        Toast.show({
            text1: message,
            type: "success"
        })
        
    }else{
        
        Toast.show({
            text1: message,
            type: "error"
        })
    }

    set({ loading: true})


  }
  
});
