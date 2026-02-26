import { useEffect } from 'react';
import { useBankCard } from '..';

export function useBankCardState() {
  const { loading, error, bank_cards } = useBankCard();

  const data = {
    bank_cards,
  };

  return {
    loading,
    error,
    data,
  };
}

export function useFetchBankCards() {
  const { getBankCards } = useBankCard();

  useEffect(() => {
    const fetchBankCards = async () => {
      const fetches = [getBankCards()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.error('One or more bank cards fetches failed:', err);
      }
    };

    fetchBankCards();
  }, [getBankCards]);
}
