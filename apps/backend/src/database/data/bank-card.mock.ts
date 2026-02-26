import { IBankCard } from "@shared/shared/src/types/bank-cards";
import { v4 as uuidv4 } from 'uuid';

export const mockBankCardSeed: (response) => Promise<IBankCard[]> =( async (response: { id: string }[]) => {
    const user_id = response.map((u) => u.id);

    return [
        {
            "id": uuidv4(),
            "user_id": user_id[0],
            "card_type": "visa",
            "payment_token": "token123",
            "last_four_digits": "1234",
            "is_active": true,
            "is_default": true,
            "createdAt": "2025-11-20T23:05:31.906Z",
            "updatedAt": "2025-11-20T23:05:31.906Z"
        },
        {
            "id": uuidv4(),
            "user_id": user_id[0],
            "card_type": "mastercard",
            "payment_token": "token987",
            "last_four_digits": "9876",
            "is_active": true,
            "is_default": true,
            "createdAt": "2025-11-20T23:05:31.906Z",
            "updatedAt": "2025-11-20T23:05:31.906Z"
        }
    ]
})