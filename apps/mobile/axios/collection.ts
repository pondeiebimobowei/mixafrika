import { apiPrivate } from './axios-config';
import { Response } from '@mixafrica/shared/types/api/responses';
import { ICollectionWithCluster } from '@mixafrica/shared/types/collection';

export const getCollection = async (): Promise<Response<ICollectionWithCluster[]>> => {
  try {
    const res = await apiPrivate.get(`/collection`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: [] };
    } else {
      return { success: false, message: err.message, data: [] };
    }
  }
};


export const getCollectionById = async (id: string): Promise<Response<ICollectionWithCluster | null>> => {
    try {
        const res = await apiPrivate.get(`/collection/${id}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            return { success: false, message: err.response.data.message, data: null };
        } else {
            return { success: false, message: err.message, data: null };
        }
    }
};