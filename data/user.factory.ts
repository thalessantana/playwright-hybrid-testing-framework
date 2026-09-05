import { faker } from '@faker-js/faker';
import { CreateUserRequest, UserPayload } from '../types/user.types';

export function generateCreateUserData(overrides?: Partial<UserPayload>): UserPayload {
    const uniqueSuffix = faker.string.alphanumeric(5);

    return {
        username: `${faker.person.firstName().toLowerCase()}_${uniqueSuffix}`,
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 10 }),
        ...overrides,
    }
}

export function generateCreateUserPayload(overrides?: Partial<UserPayload>): CreateUserRequest {
    return {
        user: generateCreateUserData(overrides),
    }
}