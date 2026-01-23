import type { StateCreator } from "zustand";
import type { IWallet } from "../../../../../packages/shared/src/types/wallet";
import type { BaseSlice } from "..";
import { apiPrivate } from "@/axios";
export interface UserWallet extends BaseSlice, Omit<IWallet, "user_id"> {
    loading: boolean,
    error: string | null,
    available_balance: number,
    active_investment_principal: number,
    total_portfolio: number,

    setWallet: ({ available_balance, total_portfolio }: IWallet) => void,
    getWalletBalance: () => void,
}

export const createUserWallet: StateCreator<
UserWallet,
[],
[],
UserWallet
> = (set) => ( {
    loading: false,
    error: null,
    active_investment_principal: 0,
    
    available_balance: 0,
    total_portfolio: 0,

    setWallet: ({ available_balance, total_portfolio }) => {
        set({ available_balance, total_portfolio})
    },

    getWalletBalance: async () => {
        set({ loading: true, error: null })

        try {
            const { data: { data: { available_balance, total_portfolio }}} = await apiPrivate.get('wallet')
            set( { available_balance, total_portfolio })
        }catch(err:any){
            if (err.response) {
                set({ error: err.response.data.message, loading: false })
            } else {
                set({ error: err.message, loading: false })
            }
        }
    },

})