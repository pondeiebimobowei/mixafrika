import { createSavingsPlan, getSavingsById, getSavingsPlans } from '@/axios/savings';
import { ISaving, ISavingWithTransactions } from '@mixafrica/shared/types/saving';
import { Create_savings_plan } from '@mixafrica/shared/validation/create-savings-plan-dto';
import Toast from 'react-native-toast-message';
import { type StateCreator } from 'zustand';


export interface SavingsSlice {
  loading: boolean,
  error: string | null,

  savings: ISaving[];
  completedSavings: ISaving[];
  getSavings: () => void;
  selectedSavings: ISavingWithTransactions | null;
  getSavingsById: (id: string) => void;
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

  selectedSavings: null,

  savings: [],
  completedSavings: [],
  getSavings: async () => {
    set({ loading: true})

    const { success, data, message } = await getSavingsPlans();
    set({ savings: data, loading: false })

  },

  getSavingsById: async (id: string) => {
    set({ loading: true, error: null });
    const response = await getSavingsById(id);
    if (response.success) {
      set({
        selectedSavings: response.data,
        loading: false,
      });
    } else {
      set({ error: response.message, loading: false });
    }
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
