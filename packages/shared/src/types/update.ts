import { BaseModel } from "./base-model-type";

export interface IUpdate extends BaseModel {
  title: string;
  category: string;
  content: string;
}
