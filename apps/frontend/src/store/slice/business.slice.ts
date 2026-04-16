import type { IBusiness } from "@mixafrica/shared/src/types/business.js";
import { type Submit_business } from '../../../../../packages/shared/src/validation/submit-business-dto';
import type { StateCreator } from "zustand";
import type { BaseSlice } from "../index.js";
import { apiPrivate } from "@/axios/index.js";
import { updateBusiness } from "@/axios/business.js";

export interface UserBusiness extends BaseSlice {
    business: IBusiness | null,
    setUserBusiness: ({ business }: { business: IBusiness }) => void,
    getUserBusiness: () => void,
    updateUserBusiness: (business_data: Submit_business) => void,
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
        set({ business })
    },

    getUserBusiness: async () => {
        set({ loading: true, error: null })

        try {
            const { data: { data } } = await apiPrivate.get('/business')
            set({ business: data })
        } catch (err: any) {
            if (err.response) {
                set({ error: err.response.data.message, loading: false })
            } else {
                set({ error: err.message, loading: false })
            }
        }
        set({ loading: false, error: null })
    },

    updateUserBusiness: async (business_data) => {
        set({ loading: true, error: null })

        try {
            const { data } = await updateBusiness(business_data)
            set({ business: data })
        } catch (err: any) {
            if (err.response) {
                set({ error: err.response.data.message, loading: false })
            } else {
                set({ error: err.message, loading: false })
            }
        }
        set({ loading: false, error: null })
    },
})

