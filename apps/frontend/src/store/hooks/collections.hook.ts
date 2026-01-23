import { useEffect } from "react";
import { useCollections } from "..";

export function useCollectionState(){
    const { collections, error, loading } = useCollections()

    const data = {
        collections
    }

    return {
        loading,
        error,
        data
    }
}

export function useFetchCollections(){
    const { get_all_collections } = useCollections()

    useEffect(()=>{
    
        const fetchCollections = async () => {
            const fetches = [
                get_all_collections()
            ]

            try {
                await Promise.allSettled(fetches);
            } catch (err) {
                console.error("One or more collections fetches failed:", err);
            }
        }

        fetchCollections();
        
    }, [get_all_collections]);
}