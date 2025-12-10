import { ISaving, ISavingWithTransactions } from "@mixafrica/shared/types/saving";
import { apiPrivate } from "./axios-config";
import { Create_savings_plan } from "@mixafrica/shared/validation/create-savings-plan-dto";
import { Response } from "@mixafrica/shared/types/api/responses";


export const createSavingsPlan = async (data: Create_savings_plan): Promise<Response<ISaving | null>> => {
    try {
        const res = await apiPrivate.post(`/savings`, data);
        return res.data;
    } catch (err: any) {
        if (err.response?.data) {
            return err.response.data;
        }
        return { success: false, message: err.message, data: null };
    }
};

export const getSavingsPlans = async (): Promise<Response<ISaving[]>> => {
    try {
        const res = await apiPrivate.get(`/savings`);
        return res.data;
    } catch (err: any) {
        if (err.response?.data) {
            return err.response.data;
        }
        return { success: false, message: err.message, data: [] };
    }
};

export const getSavingsById = async (id: string): Promise<Response<ISavingWithTransactions | null>> => {
    try {
        const res = await apiPrivate.get(`/savings/${id}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            return { success: false, message: err.response.data.message, data: null };
        } else {
            return { success: false, message: err.message, data: null };
        }
    }
};
