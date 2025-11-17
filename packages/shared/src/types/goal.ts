import { BaseModel } from "./base-model-type";

export interface IGoal extends BaseModel {
  user_id: string;
  name: string;
  current_amount: number;
  target: number;
  image: string | null;
  target_date: string;
}
