import type { ITrader } from "../../../../../packages/shared/src/types/trader";
import type { StateCreator } from "zustand";

export interface TraderRecord {
    trader_record: ITrader | null,
    setTrader: ({ trader_record } : { trader_record : ITrader}) => void,
}

export const createTraderRecord: StateCreator<
TraderRecord,
[],
[],
TraderRecord
> = (set) => ({
    trader_record: null,
    setTrader: ({ trader_record})=>{
        set({ trader_record })
    }
})

