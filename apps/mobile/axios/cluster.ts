import { apiPrivate } from './axios-config';
import { Response } from '@mixafrica/shared/types/api/responses';
import { ICluster, IClusterWithCollection } from '@mixafrica/shared/types/cluster';

export const getCluster = async (): Promise<Response<IClusterWithCollection[]>> => {
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
