import { useEffect } from 'react';
import { useUserBusiness } from '..';

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

  useEffect(() => {
    const fetchUserBusiness = async () => {
      const fetches = [getUserBusiness()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.error('One or more wallet fetches failed:', err);
      }
    };

    fetchUserBusiness();
  }, [getUserBusiness]);
}
