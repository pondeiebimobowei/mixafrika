import { IFundingApplication } from "@shared/shared/src/types/funding-application";
import { v4 as uuidv4 } from 'uuid';

export const mockApplicationSeed: (response) => Promise<IFundingApplication[]> =( async (response: { id: string }[]) => {
    const user_id = response.map((u) => u.id)
      const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return [
        {
        "id": uuidv4(),
        "user_id": user_id[0],
        "business_type": "auto_mobile",
        "business_location": "lagos",
        "amount": randomNumber(30000,5000000),
        "duration": "30_days",
        "repayment_plan": "daily",
        "purpose": "For boosting account",
        "statement_of_account_doc": "https://res.cloudinary.com/di1vgb850/image/upload/v1763679930/dev_mix/wk7hqvjdttruug1gsugk.heic",
        "createdAt": "2025-11-20T23:05:31.906Z",
        "updatedAt": "2025-11-20T23:05:31.906Z"
      }]
})