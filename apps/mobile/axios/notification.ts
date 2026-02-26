import { GroupedNotifications } from '@mixafrica/shared/types/notification';
import { apiPrivate } from './axios-config';

export const getNotification = async (): Promise<{
  success: boolean;
  message: string;
  data: GroupedNotifications | null;
}> => {
  try {
    const res = await apiPrivate.get(`/notification`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
