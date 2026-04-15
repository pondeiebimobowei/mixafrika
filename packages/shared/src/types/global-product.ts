import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IGlobalProduct extends BaseModel, SyncableModel {
  name: string,
  normalized_name: string,
  description: string,
  barcode: string,
  image_url: string,


  category_id?: string,
}
