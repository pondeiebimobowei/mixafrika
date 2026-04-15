import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IProductCategory extends BaseModel, SyncableModel {
  name: string
}
