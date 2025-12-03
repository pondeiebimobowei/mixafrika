import { getCluster } from '@/axios/cluster';
import { ICluster, IClusterWithCollection } from '@mixafrica/shared/types/cluster';
import type { StateCreator } from 'zustand';

export interface Cluster {
  loading: boolean;
  error: string | null;
  cluster: IClusterWithCollection[];
  get_cluster: ()=> void;

}

export const createCluster: StateCreator<
  Cluster,
  [],
  [],
  Cluster
> = (set) => ({
  loading: false,
  error: null,
  cluster: [],

  get_cluster: async () => {
      set({ loading: true, error: null });
      const response = await getCluster();
      if (response.success) {
        set({
          cluster: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    }
});

