import { ILoanAccountWithCluster } from '@mixafrica/shared/types/loan-account';
import { apiPrivate } from './axios-config';
import { Response } from '@mixafrica/shared/types/api/responses';

export const getLoanAccount = async (): Promise<Response<ILoanAccountWithCluster | null>> => {
  try {
    const res = await apiPrivate.get(`/loan-account`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
