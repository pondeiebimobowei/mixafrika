import { useEffect } from 'react';
import { useRepaymentHistoryStore } from '..';

export function useLoanRepaymentHistory() {
  const { repayment_history, loading, error } = useRepaymentHistoryStore();

  const data = {
    repayment_history,
    loading,
    error
  };

  return {
    data,
  };
}

export function useFetchLoanRepaymentHistory() {
  const { get_repayment_history, } = useRepaymentHistoryStore();

  useEffect(() => {
    const fetchRepaymentHistory = async () => {
      const fetches = [get_repayment_history()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more notification fetches failed');
      }
    };
    fetchRepaymentHistory();
  }, [get_repayment_history]);
}
