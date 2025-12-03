import { useEffect } from 'react';
import { useClusterStore } from '..';

export function useClusterState() {
  const { cluster, loading, error } = useClusterStore();

  const data = {
    cluster
  };

  return {
    data,
    loading,
    error
  };
}

export function useFetchCluster() {
  const { get_cluster } = useClusterStore();

  useEffect(() => {
    const fetchCluster = async () => {
      const fetches = [get_cluster()];

      try {
        await Promise.allSettled(fetches);
      } catch (err) {
        console.log('One or more loan account fetches failed');
      }
    };
    fetchCluster();
  }, [get_cluster]);
}
