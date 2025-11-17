import { useEffect } from 'react';
import { useWallet } from '..';

export function useWalletState() {
  const { loading, error, amount, total_portfolio } = useWallet();

  const data = {
    amount,
    total_portfolio,
  };

  return {
    loading,
    error,
    data,
  };
}

export function useFetchWallet() {
  const { getWalletBalance } = useWallet();

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const fetches = [getWalletBalance()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.error('One or more wallet fetches failed:', err);
      }
    };

    fetchWalletBalance();
  }, [getWalletBalance]);
}
