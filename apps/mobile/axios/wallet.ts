import { IWallet } from "@mixafrica/shared/types/wallet";
import { apiPrivate } from "./axios-config";
import { ITransaction } from "@mixafrica/shared/types/transaction";

interface Response {
  success: boolean;
  message: string;
  data: { wallet: IWallet, transaction: ITransaction } | null;
}

export const fundWallet = async (amount: number): Promise<Response> => {
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