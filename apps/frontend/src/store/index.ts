
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice, type AuthSlice } from './authSlice';
import { createTransactionsSlice, type TransactionsSlice } from './transactionsSlice';
import { createNotificationsSlice, type NotificationsSlice } from './notificationsSlice';
import { createGoalsSlice, type GoalsSlice } from './goalsSlice';

export const useAuthStore = create<AuthSlice>()(
  immer((...a) => ({
    ...createAuthSlice(...a),
  }))
);

export const useTransactionsStore = create<TransactionsSlice>()(
  immer((...a) => ({
    ...createTransactionsSlice(...a),
  }))
);

export const useNotificationsStore = create<NotificationsSlice>()(
  immer((...a) => ({
    ...createNotificationsSlice(...a),
  }))
);

export const useGoalsStore = create<GoalsSlice>()(
  immer((...a) => ({
    ...createGoalsSlice(...a),
  }))
);

export * from './authSlice';
export * from './transactionsSlice';
export * from './notificationsSlice';
export * from './goalsSlice';
