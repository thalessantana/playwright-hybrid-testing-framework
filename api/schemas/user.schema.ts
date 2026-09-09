import { z } from 'zod';

// 1 - Requests ---------------------------------------------------------------------------

export const CreateUserPayloadSchema = z.object({
    username: z.string().min(1, 'Username cannot be empty'),
    email: z.email('Invalid email format'),
    password: z.string().min(1, 'Password cannot be empty')
});

export const CreateUserRequestSchema = z.object({
    user: CreateUserPayloadSchema
});

export const UpdateUserPayloadSchema = CreateUserPayloadSchema.partial().extend({
    bio: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
});

export const UpdateUserRequestSchema = z.object({
    user: UpdateUserPayloadSchema
});

// 2 - Responses --------------------------------------------------------------------------

export const UserResponseDataSchema = z.object({
    email: z.email('Invalid email format'),
    token: z.string().min(1, 'Token cannot be empty'),
    username: z.string().min(1, 'Username cannot be empty'),
    bio: z.string().nullable(),
    image: z.string().nullable()
});

export const UserResponseSchema = z.object({
    user: UserResponseDataSchema
});

export const ProfileResponseDataSchema = z.object({
    username: z.string().min(1, 'Username cannot be empty'),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean()
});

export const ProfileResponseSchema = z.object({
    profile: ProfileResponseDataSchema    
});

// 3 - Inferred Types ---------------------------------------------------------------------

export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type UserResponseData = z.infer<typeof UserResponseDataSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ProfileResponseData = z.infer<typeof ProfileResponseDataSchema>
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>