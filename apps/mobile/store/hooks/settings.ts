import { useEffect } from 'react';
import { useUserSettings } from '..';

export function useUserSettingsState() {
  const { enable_dark_mode, enable_email_notification, enable_push_notification, error, loading } = useUserSettings();

  const data = {
    enable_dark_mode, 
    enable_email_notification,
    enable_push_notification
  };

  return {
    loading,
    error,
    data,
  };
}

export function useFetchUserSettings() {
  const { getUserSettings } = useUserSettings();

  useEffect(() => {
    const fetchUserSettings = async () => {
      const fetches = [getUserSettings()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.error('One or more settings fetches failed:', err);
      }
    };

    fetchUserSettings();
  }, [getUserSettings]);
}
