import { BaseModel } from "./base-model-type";

export interface IFeed extends BaseModel {
  user_id: string;
  content: string;
  image_url: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
}
