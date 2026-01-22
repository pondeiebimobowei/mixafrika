import { Response } from '@mixafrica/shared/types/api/responses';
import { apiPrivate } from './axios-config';
import { IUser } from '@mixafrica/shared/types/user';
import { Verify_identity } from '@mixafrica/shared/validation/verify-identity-dto';


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

export const verifyIdentity = async (data: Verify_identity): Promise<Response<IUser | null>> => {
  try {
    const formData = new FormData();
    formData.append('id_type', data.id_type);
    formData.append('id_number', data.id_number);

    const id_image_front = data.id_image_front;
    const id_image_back = data.id_image_back;
    
    if (id_image_front) {
      formData.append('id_image_front', {
        uri: id_image_front.uri,
        name: id_image_front.name || id_image_front.fileName || id_image_front.uri.split('/').pop(),
        type: id_image_front.mimeType || id_image_front.type || 'application/octet-stream',
      } as any);
    }
    
    if (id_image_back) {
      formData.append('id_image_back', {
        uri: id_image_back.uri,
        name: id_image_back.name || id_image_back.fileName || id_image_back.uri.split('/').pop(),
        type: id_image_back.mimeType || id_image_back.type || 'application/octet-stream',
      } as any);
    }

    const res = await apiPrivate.post(`/user/verify-identity`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
