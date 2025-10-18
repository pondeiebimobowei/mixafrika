import { Status } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IInvestment extends BaseModel {
  user_id: string;
  cluster_id: string;
  amount_invested: number;
  current_value: number;
  cycle_progress: number;
  cycle_ends: Date;
  status: Status;
}
