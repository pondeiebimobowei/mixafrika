import { INotification } from "@shared/shared/src/types/notification";

export const mockNotificationSeed: (response) => Promise<INotification[]> =( async (response: { id: string }[]) => {
    const userId = response.map((u) => u.id)
    return [
        {
            message: 'Check out the new dashboard layout!',
            read: true,
            type: "goal",
            title: "New Feature Alert",
            id: "e0a8f73f-5428-4e3d-a59d-b1a9671f3b8a",
            user_id: userId[0],
            createdAt: "2025-11-25T10:13:42.425Z",
            updatedAt: "2025-11-25T10:13:42.425Z",
        },
        {
            message: 'Check out the new dashboard layout!',
            read: true,
            type: "goal",
            title: "New Feature Alert",
            id: "e0a8f73f-5428-4e3d-a59d-b1a9671f3b9b",
            user_id: userId[0],
            createdAt: "2025-11-25T10:13:42.425Z",
            updatedAt: "2025-11-25T10:13:42.425Z",
        },
        {
            message: 'Check out the new dashboard layout!',
            read: true,
            type: "goal",
            title: "New Feature Alert",
            id: "e0a8f73f-5428-4e3d-a59d-b1a9671f3b1e",
            user_id: userId[0],
            createdAt: "2025-11-24T10:13:42.425Z",
            updatedAt: "2025-11-24T10:13:42.425Z",
        },
        {
            message: 'Check out the new dashboard layout!',
            read: true,
            type: "goal",
            title: "New Feature Alert",
            id: "e0a8f73f-5428-4e3d-a59d-b1a9671f3b2f",
            user_id: userId[0],
            createdAt: "2025-11-12T16:13:42.425Z",
            updatedAt: "2025-11-12T16:13:42.425Z",
        },
        {
            message: 'The weekly sync is tomorrow at 10am',
            type: "goal",
            read: true,
            title: "Meeting Reminder",
            id: "e0a8f73f-5428-4e3d-a59d-b1a9671f3b9d",
            user_id: userId[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        }
    ]
})