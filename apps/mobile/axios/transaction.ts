import { Response } from '@mixafrica/shared/types/api/responses';
import { Filters } from '../app/(protected)/(trader)/transactions';
import { apiPrivate } from './axios-config';
import { ITransaction } from '@mixafrica/shared/types/transaction';


export const getTransactions = async (type?: Filters): Promise<Response<Record<string, ITransaction[] | []>>> => {
  try {
    const res = await apiPrivate.get(`/transactions`, {
      params: { type }
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: {} };
    } else {
      return { success: false, message: err.message, data: {} };
    }
  }
};
