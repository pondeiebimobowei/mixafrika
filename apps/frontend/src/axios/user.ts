import { apiPrivate } from ".";
import type { Response } from "../../../../packages/shared/src/types/api/responses";
import type { IUser } from "../../../../packages/shared/src/types/user";

export const getAllUsers = async (): Promise<Response<IUser[]>> =>{
    try {
        const res = await apiPrivate.get( `/admin/user` );
        return res.data;

    }catch(err:any){
        if (err.response) {
            return { success: false, message: err.response.data.message, data: [] };
        } else {
            return {success: false, message: err.message, data: [] }
        }
    }
}

