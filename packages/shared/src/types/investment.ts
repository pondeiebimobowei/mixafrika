import { Status } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IInvestment extends BaseModel {
  user_id: string;
  cluster_id: string;
  amount_invested: number;
  total_earnings: number;
  status: Status;
}
