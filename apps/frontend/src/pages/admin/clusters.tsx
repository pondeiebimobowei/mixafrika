import { Plus } from "lucide-react";
import type { ICluster } from "../../../../../packages/shared/src/types/cluster";

import { useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import ClusterCard from "@/components/admin/card/cluster-card";

export default function ClustersPage(){
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

    const clusters: ICluster[] = [
        
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                <h2 className="text-xl font-bold text-gray-900">Investment Cluster</h2>
                <p className="text-sm text-gray-500">Manage funds, assign agents, and track performance</p>
                </div>
                <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                <Plus size={18} /> Create New Cluster
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                {clusters.map((cluster) => (
                <ClusterCard 
                    key={cluster.id} 
                    cluster={cluster} 
                    onClick={() => setSelectedClusterId(cluster?.id || '')} 
                />
                ))}
                {/* Empty State / Add Placeholder */}
                <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-white">
                    <Plus size={32} />
                </div>
                <span className="font-bold">Create New Cluster</span>
                </button>
            </div>

            {/* {isCreateModalOpen && <CreateClusterModal onClose={() => setIsCreateModalOpen(false)} />} */}
            {/* {selectedClusterId && <ClusterDetailSlideOver />} */}
            </div>
        </AdminLayout>
    )
}