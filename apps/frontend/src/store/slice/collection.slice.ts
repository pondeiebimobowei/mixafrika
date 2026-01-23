
import type { ICollection } from '../../../../../packages/shared/src/types/collection';
import { type StateCreator } from 'zustand';
import { getAllCollections } from '@/axios/collection';


export interface CollectionSlice {
  collections: ICollection[];
  loading: boolean;
  error: string | null;
  get_all_collections: () => void;
}

export const createCollectionSlice: StateCreator<
  CollectionSlice,
  [],
  [],
  CollectionSlice
> = (set) => ({
  collections: [],
  error: null,
  loading: false, // Loading is now handled by persist middleware hydration
  
  get_all_collections: async() => {
    set({ loading: true, error: null });
    
        const { data, success, message } = await getAllCollections();
        
        if (success) {
          set({ collections: data });
        } else {
          set({ error: message });
        }
        set({ loading: false });
    
  },
});
