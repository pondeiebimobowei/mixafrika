import { apiPrivate } from '@/axios';
import { getNotification } from '@/axios/notification';
import { GroupedNotifications } from '@mixafrica/shared/types/notification';
import { type StateCreator } from 'zustand';

const initialNotificationsData: GroupedNotifications = {
  last_week: [],
  this_week: [],
  older: [],
  today: [],
};

export interface NotificationsSlice {
  notifications: GroupedNotifications;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: number) => void;
  getNotifications: () => void;
  loading: boolean;
  error: string | null;
}

export const createNotificationsSlice: StateCreator<
  NotificationsSlice,
  [['zustand/immer', never]],
  [],
  NotificationsSlice
> = (set) => ({
  loading: false,
  error: null,

  notifications: initialNotificationsData,
  addNotification: () => {},
  markNotificationAsRead: (id) => {},
  getNotifications: async () => {
    set({ loading: true, error: null });
    const response = await getNotification();
    if (response.success) {
      set({
        notifications: response.data ? response.data : initialNotificationsData,
        loading: false,
      });
    } else {
      set({ error: response.message, loading: false });
    }
  },
});
