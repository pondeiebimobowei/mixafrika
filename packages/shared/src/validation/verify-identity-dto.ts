import { z } from 'zod';

export const verify_identity = z.object({
    id_type: z.string().min(1, { message: "ID Type is required" }),
    id_number: z.string().min(1, { message: "ID Number is required" }),
    id_image_front: z.any(),
    id_image_back: z.any()

});

export type Verify_identity = z.infer<typeof verify_identity>;
