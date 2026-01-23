import { useEffect } from "react";
import { useUsers } from "..";

export function useUsersState(){
    const { user, error, loading } = useUsers()

    const data = {
        user
    }

    return {
        loading,
        error,
        data
    }

    
}

export function useFetchUsers(){
    const { get_all_users } = useUsers()

    useEffect(()=>{
    
        const fetchUserBusiness = async () => {
            const fetches = [
                get_all_users()
            ]

            try {
                await Promise.allSettled(fetches);
            } catch (err) {
                console.error("One or more wallet fetches failed:", err);
            }
        }

        fetchUserBusiness();
        
    }, [get_all_users]);
}