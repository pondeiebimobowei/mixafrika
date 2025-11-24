import { Response } from "@mixafrica/shared/types/api/responses";
import { apiPrivate } from "./axios-config";
import { ITransaction } from "@mixafrica/shared/types/transaction";

export const fundWallet = async (amount: number): Promise<Response<ITransaction | null>> => {
  try {
    const res = await apiPrivate.post(`/wallet`, { amount });
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      return err.response.data;
    }
    return { success: false, message: err.message, data: null };
  }
};

export const repayLoan = async (amount: number): Promise<Response<ITransaction | null >> => {
  try {
    const res = await apiPrivate.post(`/loan-account/repay`, { amount });
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      return err.response.data;
    }
    return { success: false, message: err.message, data: null };
  }
};