import { useCallback } from 'react';
import { useSavingsStore } from '..';
import { useFocusEffect } from 'expo-router';

export function useSavingsState() {
  const { loading, error, savings, addSaving, selectedSavings, getSavingsById } = useSavingsStore();

  const data = {
    savings,
    addSaving,
    selectedSavings,
    getSavingsById
  };

  return {
    data,
    error,
    loading,
  };
}

export function useFetchSavings() {
  const { getSavings } = useSavingsStore();

  useFocusEffect(
    useCallback(() => {
      const fetchSavings = async () => {
        const fetches = [getSavings()];
  
        try {
          await Promise.allSettled(fetches);
        } catch (err) {
          console.log('One or more savings fetches failed');
        }
      };
      fetchSavings();
    }, [getSavings])
  )
}
