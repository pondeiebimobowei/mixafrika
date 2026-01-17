import { IFundingApplication } from "@shared/shared/src/types/funding-application";
import { v4 as uuidv4 } from 'uuid';

export const mockApplicationSeed: (response, cluster, business) => Promise<IFundingApplication[]> =( async (response: { id: string }[], cluster: { id: string }[], business: { id: string }[]) => {
    const user_id = response.map((u) => u.id);
    const cluster_id = cluster.map((u) => u.id)
    const business_id = business.map((u) => u.id)

    return [
        {
        "id": uuidv4(),
        "user_id": user_id[0],
        "user_business_id": business_id[0],
        "cluster_id": cluster_id[0],
        "amount": 800_000,
        "allocated_amount": 800_000,
        "duration": 30,
        "repayment_plan": "daily",
        "purpose": "For boosting account",
        "statement_of_account_doc": "https://res.cloudinary.com/di1vgb850/image/upload/v1763679930/dev_mix/wk7hqvjdttruug1gsugk.heic",
        "approved_at": "2025-11-20T23:05:31.906Z",
        "createdAt": "2025-11-20T23:05:31.906Z",
        "updatedAt": "2025-11-20T23:05:31.906Z"
      }]
})