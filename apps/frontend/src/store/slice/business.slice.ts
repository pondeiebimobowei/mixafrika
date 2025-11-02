import type { IUserBusiness } from "../../../../../packages/shared/src/types/user-business.js";
import type { StateCreator } from "zustand";

export interface UserBusiness {
    business: IUserBusiness | null,
    setUserBusiness: ({ business} : { business: IUserBusiness}) => void,
}

export const createUserBusiness: StateCreator<
UserBusiness,
[],
[],
UserBusiness
> = (set) => ({
    business: null,
    setUserBusiness: ({ business})=>{
        set({ business })
    }
})

