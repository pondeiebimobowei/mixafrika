import { apiPrivate } from ".";
import type { Response } from "../../../../packages/shared/src/types/api/responses";
import type { ICollection } from "../../../../packages/shared/src/types/collection";

export const getAllCollections = async (): Promise<Response<ICollection[]>> =>{
    try {
        const res = await apiPrivate.get( `/admin/collection` );
        return res.data;

    }catch(err:any){
        if (err.response) {
            return { success: false, message: err.response.data.message, data: [] };
        } else {
            return {success: false, message: err.message, data: [] }
        }
    }
}

