import { useInvestmentStore } from '../index';

export const useInvestment = () => {
    return useInvestmentStore((state) => state.data);
};
