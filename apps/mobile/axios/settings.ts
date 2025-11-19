import { apiPrivate } from './axios-config';

export const updateDarkModeSettings = async (enable_dark_mode: boolean) => {
  try {
    const res = await apiPrivate.patch(`/settings/dark-mode`, { enable_dark_mode });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};

export const updateEmailNotificationSettings = async (enable_email_notification: boolean) => {
  try {
    const res = await apiPrivate.patch(`/settings/email-notification`, { enable_email_notification });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};

export const updatePushNotificationSettings = async (enable_push_notification: boolean) => {
  try {
    const res = await apiPrivate.patch(`/settings/push-notification`, { enable_push_notification });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};

export const getUserSettings = async () => {
  try {
    const res = await apiPrivate.get(`/settings`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
