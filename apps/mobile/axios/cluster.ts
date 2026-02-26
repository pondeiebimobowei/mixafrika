import { apiPrivate } from './axios-config';
import { Response } from '@mixafrica/shared/types/api/responses';
import { ICluster, IClusterWithCollection } from '@mixafrica/shared/types/cluster';

export const getClusters = async (id: string): Promise<Response<IClusterWithCollection[]>> => {
  try {
    const res = await apiPrivate.get(`/cluster`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: [] };
    } else {
      return { success: false, message: err.message, data: [] };
    }
  }
};


export const getClusterById = async (id: string): Promise<Response<IClusterWithCollection | null>> => {
    try {
        const res = await apiPrivate.get(`/cluster/${id}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            return { success: false, message: err.response.data.message, data: null };
        } else {
            return { success: false, message: err.message, data: null };
        }
    }
};