import { getCollection, getCollectionById } from '@/axios/collection';
import { ICollectionWithCluster } from '@mixafrica/shared/types/collection';
import type { StateCreator } from 'zustand';

export interface Collection {
  loading: boolean;
  error: string | null;
  collections: ICollectionWithCluster[];
  collection_by_id: ICollectionWithCluster | null;
  get_collection: ()=> void;
  get_collection_by_id: (id: string)=> void;

}

export const createCollection: StateCreator<
  Collection,
  [],
  [],
  Collection
> = (set) => ({
  loading: false,
  error: null,
  collections: [],
  collection_by_id: null,
  get_collection: async () => {
      set({ loading: true, error: null });
      const response = await getCollection();
      if (response.success) {
        set({
          collections: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    },
    get_collection_by_id: async (id: string) => {
      set({ loading: true, error: null });
      const response = await getCollectionById(id);
      if (response.success) {
        set({
          collection_by_id: response.data,
          loading: false,
        });
      } else {
        set({ error: response.message, loading: false });
      }
    }
});

