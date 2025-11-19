import type { StateCreator } from 'zustand';
import { BaseSlice } from '..';
import { getUserSettings, updateDarkModeSettings, updateEmailNotificationSettings, updatePushNotificationSettings } from '@/axios/settings';

export interface UserSettingsSlice extends BaseSlice {
  loading: boolean,
  error: string | null,

  enable_dark_mode: boolean,
  enable_push_notification: boolean,
  enable_email_notification: boolean,

  getUserSettings: ()=> void,
  updateDarkMode: (enable_dark_mode:boolean) => void,
  updateEmailNotification: (enable_email_notification: boolean) => void,
  updatePushNotification: (enable_push_notification: boolean) => void,
}

export const createUserSettings: StateCreator<
  UserSettingsSlice,
  [],
  [],
  UserSettingsSlice
> = (set) => ({
  loading: false,
  error: null,

  enable_dark_mode: false,
  enable_email_notification: false,
  enable_push_notification: false,

  getUserSettings: async () => {
    set({ loading: true, error: null });

    try {
      const { data: { enable_dark_mode, enable_email_notification, enable_push_notification} } = await getUserSettings();
      set({ enable_dark_mode, enable_email_notification, enable_push_notification });
    } catch (err: any) {
      if (err.response) {
        set({ error: err.response.data.message, loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
    }
    set({ loading: false, error: null });
  },

  updateDarkMode: async (enable_dark_mode) => {
    set({ loading: true, error: null });
    
    const response = await updateDarkModeSettings(enable_dark_mode);
    if(response.success){
        set({ enable_dark_mode })
    }else{
        set({ error: response.message, })
    }

    set({ loading: false })
  },

  updateEmailNotification: async (enable_email_notification) => {
    set({ loading: true, error: null });

    const response = await updateEmailNotificationSettings(enable_email_notification);
    if(response.success){
        set({ enable_email_notification })
    }else{
        set({ error: response.message, })
    }

    set({ loading: false })
  },

  updatePushNotification: async (enable_push_notification) => {
    set({ loading: true, error: null });

    const response = await updatePushNotificationSettings(enable_push_notification);
    if(response.success){
        set({ enable_push_notification })
    }else{
        set({ error: response.message, })
    }

    set({ loading: false })
  },
});
