import { faker } from "@faker-js/faker";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@api/schemas/article.schema";

const UNIQUE_SUFFIX_LENGTH = 5;
const DEFAULT_TAGS_COUNT = 2;

/**
 * Generates a short random alphanumeric string used to ensure title uniqueness.
 * @returns A lowercase alphanumeric string of {@link UNIQUE_SUFFIX_LENGTH} characters.
 */
function generateUniqueSuffix(): string {
  return faker.string.alphanumeric({
    length: UNIQUE_SUFFIX_LENGTH,
    casing: "lower",
  });
}

// 1 - Create ------------------------------------------------------------------------------

/**
 * Generates raw article data for the create-article endpoint.
 * @param overrides - Optional partial fields to override the generated defaults.
 * @returns A complete {@link CreateArticlePayload} with random but valid values.
 */
export function generateCreateArticleData(
  overrides?: Partial<CreateArticlePayload>,
): CreateArticlePayload {
  return {
    title: `${faker.book.title()}-${generateUniqueSuffix()}`,
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    tagList: faker.helpers.uniqueArray(
      () => faker.word.sample().toLowerCase(),
      DEFAULT_TAGS_COUNT,
    ),
    ...overrides,
  };
}

/**
 * Wraps {@link generateCreateArticleData} in the `{ article: ... }` envelope expected by the API.
 * @param overrides - Optional partial fields forwarded to {@link generateCreateArticleData}.
 * @returns A ready-to-send {@link CreateArticleRequest} payload.
 */
export function generateCreateArticlePayload(
  overrides?: Partial<CreateArticlePayload>,
): CreateArticleRequest {
  return {
    article: generateCreateArticleData(overrides),
  };
}

// 2 - Update ------------------------------------------------------------------------------

/**
 * Generates raw article data for the update-article endpoint.
 * @param overrides - Optional partial fields to override the generated defaults.
 * @returns A complete {@link UpdateArticlePayload} with random but valid values.
 */
export function generateUpdateArticleData(
  overrides?: Partial<UpdateArticlePayload>,
): UpdateArticlePayload {
  return {
    title: `updated-${faker.book.title()}-${generateUniqueSuffix()}`,
    description: `Updated description: ${faker.lorem.sentence()}`,
    body: `Updated body: ${faker.lorem.paragraphs()}`,
    ...overrides,
  };
}

/**
 * Wraps {@link generateUpdateArticleData} in the `{ article: ... }` envelope expected by the API.
 * @param overrides - Optional partial fields forwarded to {@link generateUpdateArticleData}.
 * @returns A ready-to-send {@link UpdateArticleRequest} payload.
 */
export function generateUpdateArticlePayload(
  overrides?: Partial<UpdateArticlePayload>,
): UpdateArticleRequest {
  return {
    article: generateUpdateArticleData(overrides),
  };
}
