import { IUserVerification } from '@shared/shared/src/types/user-verification';
import { v4 as uuidv4 } from 'uuid';

export const mockUserVerificationSeed: (user) => Promise<IUserVerification[]> =( async (user: { id: string }[]) => {
    const user_id = user.map((u) => u.id);

    return [
        {
            "id": uuidv4(),
            "user_id": user_id[0],
            "status": "pending",
            "rejection_reason": "",
            "type": "national_id",
            "submitted_at": "2025-11-20T23:05:31.906Z",
            "id_image_front_url": "https://picsum.photos/seed/401/150/150",
            "id_number": "1234567890",
            "id_image_back_url": "https://picsum.photos/seed/401/150/150",
            "reviewed_by": user_id[0],
            "reviewed_at": "2025-11-20T23:05:31.906Z",
            "createdAt": "2025-11-20T23:05:31.906Z",
            "updatedAt": "2025-11-20T23:05:31.906Z"
        }
    ]
})