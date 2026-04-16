import { v4 as uuidv4 } from 'uuid';
import { IBranchUser } from '@shared/shared/src/types/branch-user';
export const mockBranchUserSeed: (user, branch) => Promise<IBranchUser[]> = (async ( user: { id: string }[], branch: { id: string }[]) => {
  const user_id = user.map((u) => u.id);
  const branch_id = branch.map((b) => b.id);
  return [
    {
      id: uuidv4(),
      role: 'staff',
      is_active: true,
      assigned_at: "2025-11-12T16:13:42.425Z",

      user_id: user_id[0],
      branch_id: branch_id[0],

      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },

    {
      id: uuidv4(),
      role: 'staff',
      is_active: true,
      assigned_at: "2025-11-12T16:13:42.425Z",

      user_id: user_id[0],
      branch_id: branch_id[1],

      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    }
  ]
});
