import { Submit_business } from '@mixafrica/shared/validation/submit-business-dto';
import { apiPrivate } from './axios-config';
import { IUserBusiness } from '@mixafrica/shared/types/user-business';
import { Response } from '@mixafrica/shared/types/api/responses';



export const updateBusiness = async (data: Submit_business): Promise<Response<IUserBusiness[]>> => {
  try {
    const res = await apiPrivate.post(`/v1/business`, { ...data });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: [] };
    } else {
      return { success: false, message: err.message, data: [] };
    }
  }
};

export const submitBusinessKyc = async (data: Submit_business): Promise<Response<IUserBusiness | null>> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type', data.type);
    formData.append('street_address', data.street_address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('phone', data.phone);

    if (data.cac_document && data.cac_document.uri) {
        formData.append('cac_document', {
            uri: data.cac_document.uri,
            name: data.cac_document.name  || data.cac_document.uri.split('/').pop(),
            type: data.cac_document.mimeType || 'application/octet-stream',
        } as any);
    }

    if (data.national_id_document && data.national_id_document.uri) {
        formData.append('national_id_document', {
            uri: data.national_id_document.uri,
            name: data.national_id_document.name || data.national_id_document.uri.split('/').pop() || 'id_doc',
            type: data.national_id_document.mimeType || 'image/jpeg',
        } as any);
    }

    const res = await apiPrivate.post(`/business`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};
