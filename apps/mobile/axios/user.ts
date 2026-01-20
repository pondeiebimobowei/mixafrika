import { Response } from '@mixafrica/shared/types/api/responses';
import { apiPrivate } from './axios-config';
import { IUser } from '@mixafrica/shared/types/user';


export const getUser = async (): Promise<Response<IUser | null>> => {
  try {
    const res = await apiPrivate.get(`/user`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
