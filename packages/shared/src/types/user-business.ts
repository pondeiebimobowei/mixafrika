import { type BaseModel } from "./base-model-type";
import { type IBusinessVerification } from "./business-verification";
import { type ICollection } from "./collection";

export interface IUserBusiness extends BaseModel {
  user_id: string;
  collection_id:string | null;
  name: string;
  type: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;

  verification?: IBusinessVerification;
}


export interface IUserBussinessWithCollection extends IUserBusiness {
  collection: ICollection[]
}
