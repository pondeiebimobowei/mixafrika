import { Submit_business } from '@mixafrica/shared/validation/submit-business-dto';
import { apiPrivate } from './axios-config';
import { IUserBusiness } from '@mixafrica/shared/types/user-business';
import { Response } from '@mixafrica/shared/types/api/responses';



export const updateBusiness = async (data: Submit_business): Promise<Response<IUserBusiness | null>> => {
  try {
    const res = await apiPrivate.post(`/business`, { ...data });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
