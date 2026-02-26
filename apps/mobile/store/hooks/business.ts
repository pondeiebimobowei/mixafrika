import { useCallback } from 'react';
import { useUserBusiness } from '..';
import { useFocusEffect } from 'expo-router';

export function useBusinessState() {
  const { business, error, loading } = useUserBusiness();

  const data = {
    business,
  };

  return {
    loading,
    error,
    data,
  };
}

export function useFetchBusiness() {
  const { getUserBusiness } = useUserBusiness();

  useFocusEffect(
    useCallback(() => {
      const fetchUserBusiness = async () => {
        const fetches = [getUserBusiness()];

        try {
          await Promise.allSettled(fetches);
        } catch (err) {
          console.error('One or more wallet fetches failed:', err);
        }
      };

      fetchUserBusiness();
    }, [getUserBusiness])
  );
}
