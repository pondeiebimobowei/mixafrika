import type { StateCreator } from "zustand";
import type { IWallet } from "../../../../../packages/shared/src/types/wallet";
export interface UserWallet {
    wallet: IWallet,
    setWallet: ({ wallet }: { wallet : IWallet }) => void
}

export const createUserWallet: StateCreator<
UserWallet,
[],
[],
UserWallet
> = (set) => ( {
    wallet: {
        amount: 0,
        total_portfolio: 0,
        user_id: '',
    },

    setWallet: ({ wallet }) => {
        set({ wallet})
    }
})