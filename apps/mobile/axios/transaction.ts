import { apiPrivate } from './axios-config';
import { ITransaction } from '@mixafrica/shared/types/transaction';

interface Response {
  success: boolean;
  message: string;
  data: ITransaction[] | [];
}

export const getTransactions = async (): Promise<Response> => {
  try {
    const res = await apiPrivate.get(`/transactions`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: [] };
    } else {
      return { success: false, message: err.message, data: [] };
    }
  }
};
