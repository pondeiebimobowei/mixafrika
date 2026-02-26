import { useEffect } from 'react';
import { useClusterStore } from '..';

export function useClusterState() {
  const { clusters, loading, error, cluster_by_id, get_cluster_by_id } = useClusterStore();

  const data = {
    clusters,
    cluster_by_id,
    get_cluster_by_id
  };

  return {
    data,
    loading,
    error
  };
}


