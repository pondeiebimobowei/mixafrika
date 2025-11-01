import { type BaseModel } from "./base-model-type";
import { type IUser } from "./user";

export interface INotes extends BaseModel{
    user_id?: string,
    note: string,
}

export interface INotesWithUser extends INotes {
    user: Partial<IUser>
}