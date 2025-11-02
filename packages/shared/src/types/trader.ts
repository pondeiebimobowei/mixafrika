import { type Status } from "../enums";
import { type INotesWithUser } from "./notes";

export interface ITrader {
  experience: string;
  rating: number;
  status: Status;
  last_activity: string;
  stats: {
    amount_due: number;
    days_over_due: number;
    loan_amount: number;
    repayment_progress: number;
    total_repayment: number;
  },
  notes: INotesWithUser[]
}