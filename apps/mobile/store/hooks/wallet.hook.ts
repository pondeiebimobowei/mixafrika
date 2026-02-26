import { useCallback } from 'react';
import { useWallet } from '..';
import { useFocusEffect } from 'expo-router';

export function useWalletState() {
  const { loading, error, id, available_balance, total_growth_earned, active_investment_principal, fundWallet } = useWallet();

  const data = {
    id,
    available_balance,
    total_growth_earned, 
    active_investment_principal,
    fundWallet
  };

  return {
    loading,
    error,
    data,
  };
}

export function useFetchWallet() {
  const { getWalletBalance } = useWallet();

  useFocusEffect(
    useCallback(() => {
      const fetchWalletBalance = async () => {
        const fetches = [getWalletBalance()];

        try {
          await Promise.allSettled(fetches);
        } catch (err) {
          console.error('One or more wallet fetches failed:', err);
        }
      };

      fetchWalletBalance();
    }, [getWalletBalance])
  );
}
