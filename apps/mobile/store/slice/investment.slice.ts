import { StateCreator } from 'zustand';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { CreateInvestmentDto } from '@mixafrica/shared/src/dto/investment/create-investment.dto';
import { apiPrivate } from '@/axios/axios-config';

export interface InvestmentSlice {
    data: {
        investments: any[];
        create_investment: (payload: CreateInvestmentDto) => Promise<void>;
        get_investments: () => Promise<void>;
        is_loading: boolean;
    }
}

export const createInvestmentSlice: StateCreator<InvestmentSlice> = (set, get) => ({
    data: {
        investments: [],
        is_loading: false,
        create_investment: async (payload: CreateInvestmentDto) => {
            set((state) => ({ data: { ...state.data, is_loading: true } }));
            try {
                const response = await apiPrivate.post('/investment', payload);
                if (response.data.success) {
                    Alert.alert('Success', 'Investment successful');
                    router.back();
                }
            } catch (error: any) {
                const message = error.response?.data?.message || 'Investment failed';
                Alert.alert('Error', message);
            } finally {
                set((state) => ({ data: { ...state.data, is_loading: false } }));
            }
        },
        get_investments: async () => {
            set((state) => ({ data: { ...state.data, is_loading: true } }));
            try {
                const response = await apiPrivate.get('/investment');
                set((state) => ({ data: { ...state.data, investments: response.data.data } }));
            } catch (error) {
                console.error(error);
            } finally {
                set((state) => ({ data: { ...state.data, is_loading: false } }));
            }
        }
    }
});
