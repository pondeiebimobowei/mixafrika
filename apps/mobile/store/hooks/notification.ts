import { useEffect } from 'react';
import { useNotificationsStore } from '..';

export function useNotificationState() {
  const { notifications } = useNotificationsStore();

  const data = {
    notifications,
  };

  return {
    data,
  };
}

export function useFetchNotification() {
  const { getNotifications } = useNotificationsStore();

  useEffect(() => {
    const fetchNotification = async () => {
      const fetches = [getNotifications()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more notification fetches failed');
      }
    };
    fetchNotification();
  }, [getNotifications]);
}
