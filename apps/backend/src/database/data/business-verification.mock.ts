import { IBusinessVerification } from "@shared/shared/src/types/business-verification";
import { v4 as uuidv4 } from 'uuid';

export const mockBusinessVerificationSeed: (business, user) => Promise<IBusinessVerification[]> =( async (business: { id: string }[], user: { id: string }[]) => {
    const business_id = business.map((u) => u.id);

    return [
        {
            "id": uuidv4(),
            "business_id": business_id[0],
            "status": "verified",
            "rejection_reason": "",
            "cac_document": "https://picsum.photos/seed/401/150/150",
            "reviewed_by_id": user[0].id,
            "reviewed_at": "2025-11-20T23:05:31.906Z",
            "createdAt": "2025-11-20T23:05:31.906Z",
            "updatedAt": "2025-11-20T23:05:31.906Z"
        }
    ]
})