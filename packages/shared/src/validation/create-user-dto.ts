import { type Roles, roles } from "../enums";
import { z } from "zod";

export const create_user_dto = z.object({
  first_name: z.string().min(3, "Firstname too short!"),
  last_name: z.string().min(3, "Lastname too short!"),
  phone_number: z.string().min(11, "Phone number too short"),
  email: z.email("Enter valid email"),
  role: z.enum(Object.values(roles) as [Roles, ...Roles[]]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
})

export type Create_user_dto = z.infer<typeof create_user_dto>;
