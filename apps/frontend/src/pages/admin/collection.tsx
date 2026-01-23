import CollectionCard from "@/components/admin/card/collection-card";
import { Plus } from "lucide-react";

import { useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { useCollectionState, useFetchCollections } from "@/store/hooks/collections.hook";

export default function CollectionPage(){
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
    useFetchCollections();
    const { data: { collections } } = useCollectionState();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Investment Collection</h2>
                        <p className="text-sm text-gray-500">Manage funds, assign agents, and track performance</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <Plus size={18} /> Create New Collection
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <CollectionCard 
                            key={collection.id} 
                            collection={collection} 
                            onClick={() => setSelectedCollectionId(collection?.id || '')} 
                        />
                    ))}
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-white">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold">Create New Collection</span>
                    </button>
                </div>

                {/* {isCreateModalOpen && <CreateCollectionModal onClose={() => setIsCreateModalOpen(false)} />} */}
                {/* {selectedCollectionId && <CollectionDetailSlideOver />} */}
            </div>
        </AdminLayout>
    )
}