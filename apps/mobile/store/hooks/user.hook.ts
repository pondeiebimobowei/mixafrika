import { useCallback } from 'react';
import { useAuthStore } from '..';
import { useFocusEffect } from 'expo-router';

export function useUserState() {
  const { user } = useAuthStore();

  const data = {
    user
  };

  return {
    data,
  };
}

export function useFetchUser() {
  const { get_user } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const fetches = [get_user()];

        try {
          await Promise.allSettled(fetches);
        } catch (err) {
          console.error('One or more user fetches failed:', err);
        }
      };

      fetchUser();
    }, [get_user])
  );
}
