import { useEffect } from 'react';
import { useCollectionStore } from '..';

export function useCollectionState() {
  const { collections, loading, error, collection_by_id, get_collection_by_id } = useCollectionStore();

  const data = {
    collection_by_id,
    collections, 
    get_collection_by_id
  };

  return {
    data,
    loading,
    error
  };
}

export function useFetchCollection() {
  const { get_collection } = useCollectionStore();

  useEffect(() => {
    const fetchCollection = async () => {
      const fetches = [get_collection()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more collection fetches failed');
      }
    };
    fetchCollection();
  }, [get_collection]);
}
