import { getClusters, getClusterById } from '@/axios/cluster';
import { ICluster, IClusterWithCollection } from '@mixafrica/shared/types/cluster';
import type { StateCreator } from 'zustand';

export interface Cluster {
  loading: boolean;
  error: string | null;
  clusters: IClusterWithCollection[];
  cluster_by_id: ICluster | null;
  get_clusters: (id:string)=> void;
  get_cluster_by_id: (id: string)=> void;

}

export const createCluster: StateCreator<
  Cluster,
  [],
  [],
  Cluster
> = (set) => ({
  loading: false,
  error: null,
  clusters: [],
  cluster_by_id: null,
  get_clusters: async (id:string) => {
      set({ loading: true, error: null });
      const response = await getClusters(id);
      if (response.success) {
        set({
          clusters: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    },
    get_cluster_by_id: async (id: string) => {
      set({ loading: true, error: null });
      const response = await getClusterById(id);
      if (response.success) {
        set({
          cluster_by_id: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    }
});

