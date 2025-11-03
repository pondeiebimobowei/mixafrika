import { apiPrivate } from ".";

export const action = async (data: any) =>{
    try {
        const res = await apiPrivate.post( `/`, { ...data } );
        return res.data;

    }catch(err:any){
        if (err.response) {
            return { success: false, message: err.response.data.message, data: null };
        } else {
            return {success: false, message: err.message, data: null }
        }
    }
}

