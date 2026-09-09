import { faker } from '@faker-js/faker';
import type { CreateUserRequest, UpdateUserRequest, CreateUserPayload, UpdateUserPayload } from '@api/schemas/user.schema';

// 1 - Create ------------------------------------------------------------------------------

export function generateCreateUserData(overrides?: Partial<CreateUserPayload>): CreateUserPayload {
    const uniqueSuffix = faker.string.alphanumeric(5);

    return {
        username: `${faker.person.firstName().toLowerCase()}_${uniqueSuffix}`,
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 10 }),
        ...overrides,
    }
}

export function generateCreateUserPayload(overrides?: Partial<CreateUserPayload>): CreateUserRequest {
    return {
        user: generateCreateUserData(overrides),
    }
}

// 2 - Update ------------------------------------------------------------------------------

export function generateUpdateUserData(overrides?: Partial<UpdateUserPayload>): UpdateUserPayload {

    return {
        ...generateCreateUserData(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        ...overrides
    }
}

export function generateUpdateUserPayload(overrides?: Partial<UpdateUserPayload>): UpdateUserRequest {
    return {
        user: generateUpdateUserData(overrides),
    }
}