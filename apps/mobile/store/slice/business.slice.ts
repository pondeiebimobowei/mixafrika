import type { StateCreator } from 'zustand';
import { apiPrivate } from '@/axios';
import { BaseSlice } from '..';
import { updateBusiness } from '@/axios/business';
import { IUserBusiness } from '@mixafrica/shared/types/user-business';
import { Submit_business } from '@mixafrica/shared/validation/submit-business-dto';

export interface UserBusiness extends BaseSlice {
  business: IUserBusiness | null;
  setUserBusiness: ({ business }: { business: IUserBusiness }) => void;
  getUserBusiness: () => void;
  updateUserBusiness: (business_data: Submit_business) => void;
}

export const createUserBusiness: StateCreator<
  UserBusiness,
  [],
  [],
  UserBusiness
> = (set) => ({
  loading: false,
  error: null,
  business: null,
  setUserBusiness: ({ business }) => {
    set({ business });
  },

  getUserBusiness: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: { data },
      } = await apiPrivate.get('/business');
      set({ business: data });
    } catch (err: any) {
      if (err.response) {
        set({ error: err.response.data.message, loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
    }
    set({ loading: false, error: null });
  },

  updateUserBusiness: async (business_data) => {
    set({ loading: true, error: null });

    try {
      const { data } = await updateBusiness(business_data);
      set({ business: data });
    } catch (err: any) {
      if (err.response) {
        set({ error: err.response.data.message, loading: false });
      } else {
        set({ error: err.message, loading: false });
      }
    }
    set({ loading: false, error: null });
  },
});
