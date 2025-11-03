import type { IUserBusiness } from "../../../../../packages/shared/src/types/user-business.js";
import type { StateCreator } from "zustand";
import type { BaseSlice } from "../index.js";
import { apiPrivate } from "@/axios/index.js";

export interface UserBusiness extends BaseSlice{
    business: IUserBusiness | null,
    setUserBusiness: ({ business} : { business: IUserBusiness}) => void,
    getUserBusiness: () => void
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
    setUserBusiness: ({ business})=>{
        set({ business })
    },

    getUserBusiness: async () => {
            set({ loading: true, error: null })
    
            try {
                const { data: { data }} = await apiPrivate.get('business')
                set( { business: data })
            }catch(err:any){
                if (err.response) {
                    set({ error: err.response.data.message, loading: false })
                } else {
                    set({ error: err.message, loading: false })
                }
            }
        },
})

