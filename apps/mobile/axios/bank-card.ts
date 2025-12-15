import { apiPrivate } from "./axios-config";
import { Response } from "@mixafrica/shared/types/api/responses";
import { IBankCard } from "@mixafrica/shared/types/bank-cards";


export const getBankCards = async (): Promise<Response<IBankCard[]>> => {
    try {
        const res = await apiPrivate.get(`/bank-card`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data) {
            return err.response.data;
        }
        return { success: false, message: err.message, data: [] };
    }
};

export const getBankCardById = async (id: string): Promise<Response<IBankCard | null>> => {
    try {
        const res = await apiPrivate.get(`/bank-card/${id}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            return { success: false, message: err.response.data.message, data: null };
        } else {
            return { success: false, message: err.message, data: null };
        }
    }
};
