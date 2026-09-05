export interface UserPayload {
    username: string;
    email: string;
    password: string;
}

export interface CreateUserRequest {
    user: UserPayload;
}