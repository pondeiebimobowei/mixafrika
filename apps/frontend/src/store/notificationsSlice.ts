
import { type StateCreator } from 'zustand';
import type { Notification, NotificationsData } from '@/types';

const initialNotificationsData: NotificationsData = {
  Today: [
    {
      id: 1,
      type: 'new_match' as const,
      title: 'New Investment Opportunity!',
      message: 'A new high-yield cluster is available.',
      read: false,
      timestamp: '5m ago',
    },
    {
      id: 2,
      type: 'new_cluster' as const,
      title: 'Onitsha Electronics ROI',
      message: 'You have received a return of ₦4,800.',
      read: false,
      timestamp: '30m ago',
    },
    {
      id: 3,
      type: 'goal_achieved' as const,
      title: 'Goal Reached: New Car',
      message: 'You have reached 80% of your goal.',
      read: false,
      timestamp: '1h ago',
    },
  ],
  "This week": [
    {
      id: 4,
      type: 'new_cluster' as const,
      title: 'New Cluster: Kano Grains',
      message: 'A new agricultural cluster has been added.',
      read: false,
      timestamp: '1d ago',
    },
    {
      id: 5,
      type: 'new_match' as const,
      title: 'Balogun Textiles ROI',
      message: 'You have received a return of ₦5,000.',
      read: true,
      timestamp: '2d ago',
    },
    {
      id: 6,
      type: 'new_follower' as const,
      title: 'Tunde O. followed you',
      message: 'You have a new follower on your strategy.',
      read: true,
      timestamp: '3d ago',
    },
    {
      id: 7,
      type: 'new_match' as const,
      title: 'Aba Shoes ROI',
      message: 'You have received a return of ₦1,200.',
      read: true,
      timestamp: '5d ago',
    }
  ]
};

export interface NotificationsSlice {
  notifications: NotificationsData;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: number) => void;
}

export const createNotificationsSlice: StateCreator<
  NotificationsSlice,
  [['zustand/immer', never]],
  [],
  NotificationsSlice
> = (set) => ({
  notifications: initialNotificationsData,
  addNotification: (notification) => {
    set((state) => {
      state.notifications.Today.unshift(notification);
    });
  },
  markNotificationAsRead: (id) => {
     set(state => {
      for (const group in state.notifications) {
        const items = (state.notifications as any)[group];
        const notification = items.find((n: Notification) => n.id === id);
        if (notification && !notification.read) {
          notification.read = true;
          break;
        }
      }
    });
  }
});
