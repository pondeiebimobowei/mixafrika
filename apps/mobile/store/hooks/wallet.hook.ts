import { useEffect } from 'react';
import { useWallet } from '..';

export function useWalletState() {
  const { loading, error, id, amount, total_portfolio, fundWallet } = useWallet();

  const data = {
    id,
    amount,
    total_portfolio,
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
