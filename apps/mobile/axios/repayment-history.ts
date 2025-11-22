import { IRepaymentHistory } from '@mixafrica/shared/types/repayment-history';
import { apiPrivate } from './axios-config';

interface Response {
  success: boolean;
  message: string;
  data: IRepaymentHistory[] | [];
}

export const getRepaymentHistory = async (): Promise<Response> => {
  try {
    const res = await apiPrivate.get(`/loan-repayment-history`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: [] };
    } else {
      return { success: false, message: err.message, data: [] };
    }
  }
};
