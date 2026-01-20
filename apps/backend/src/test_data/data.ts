import { IUser } from "@shared/shared/src/types/user";

export const test_user:IUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_name: 'johndoe-1234',
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@test.com',
    password: 'password123',
    role: 'trader',
    verification_status: 'unverified',
    business_verification_status: 'unverified',
    is_email_verified: false,
    credit_score: 0,
    credit_score_status: 'not set',
    createdAt: String(new Date()),
    updatedAt: String(new Date()),
    image: null,

}