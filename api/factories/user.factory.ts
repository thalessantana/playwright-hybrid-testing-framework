import { faker } from "@faker-js/faker";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  CreateUserPayload,
  UpdateUserPayload,
} from "@api/schemas/user.schema";

// 1 - Create ------------------------------------------------------------------------------

/**
 * Generates raw user data for the create-user endpoint.
 * @param overrides - Optional partial fields to override the generated defaults.
 * @returns A complete {@link CreateUserPayload} with random but valid values.
 */
export function generateCreateUserData(
  overrides?: Partial<CreateUserPayload>,
): CreateUserPayload {
  const uniqueSuffix = faker.string.alphanumeric(5);

  return {
    username: `${faker.person.firstName().toLowerCase()}_${uniqueSuffix}`,
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    ...overrides,
  };
}

/**
 * Wraps {@link generateCreateUserData} in the `{ user: ... }` envelope expected by the API.
 * @param overrides - Optional partial fields forwarded to {@link generateCreateUserData}.
 * @returns A ready-to-send {@link CreateUserRequest} payload.
 */
export function generateCreateUserPayload(
  overrides?: Partial<CreateUserPayload>,
): CreateUserRequest {
  return {
    user: generateCreateUserData(overrides),
  };
}

// 2 - Update ------------------------------------------------------------------------------

/**
 * Generates raw user data for the update-user endpoint, including bio and avatar.
 * @param overrides - Optional partial fields to override the generated defaults.
 * @returns A complete {@link UpdateUserPayload} with random but valid values.
 */
export function generateUpdateUserData(
  overrides?: Partial<UpdateUserPayload>,
): UpdateUserPayload {
  return {
    ...generateCreateUserData(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
    ...overrides,
  };
}

/**
 * Wraps {@link generateUpdateUserData} in the `{ user: ... }` envelope expected by the API.
 * @param overrides - Optional partial fields forwarded to {@link generateUpdateUserData}.
 * @returns A ready-to-send {@link UpdateUserRequest} payload.
 */
export function generateUpdateUserPayload(
  overrides?: Partial<UpdateUserPayload>,
): UpdateUserRequest {
  return {
    user: generateUpdateUserData(overrides),
  };
}

// 3 - Negative Testing Helpers -------------------------------------------------------------

/**
 * Generates a unique invalid password for negative login tests.
 * Avoids hardcoded credential strings that trigger security scanners.
 * @returns A deterministically invalid password string.
 */
export const generateInvalidPassword = (): string =>
  `invalid_${Date.now()}_pwd`;
