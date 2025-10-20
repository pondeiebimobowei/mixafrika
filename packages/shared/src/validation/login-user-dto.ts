import { z } from "zod";

export const login_user_dto = z.object({
  email: z.string().email('Enter valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
}).required();

export type Login_user_dto = z.infer<typeof login_user_dto>;
