import { useEffect } from 'react';
import { useLoanAccountStore } from '..';

export function useLoanAccountState() {
  const { loan_account, repay_loan, loading, error } = useLoanAccountStore();

  const data = {
    loan_account,
    repay_loan
  };

  return {
    data,
    loading,
    error
  };
}

export function useFetchLoanAccount() {
  const { get_loan_account } = useLoanAccountStore();

  useEffect(() => {
    const fetLoanAccount = async () => {
      const fetches = [get_loan_account()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more loan account fetches failed');
      }
    };
    fetLoanAccount();
  }, [get_loan_account]);
}
