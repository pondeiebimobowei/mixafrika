import { useEffect } from 'react';
import { useTransactionsStore } from '..';

export function useTransactionState() {
  const { loading, error, transactions } = useTransactionsStore();

  const data = {
    loading,
    error,
    transactions
  };

  return {
    data,
  };
}

export function useFetchTransaction() {
  const { getTransactions } = useTransactionsStore();

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetches = [getTransactions()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more notification fetches failed');
      }
    };
    fetchTransactions();
  }, [getTransactions]);
}
