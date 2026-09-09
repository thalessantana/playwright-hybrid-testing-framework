import { faker } from '@faker-js/faker';
import type { 
    CreateArticleRequest,
    UpdateArticleRequest,
    CreateArticlePayload,
    UpdateArticlePayload
} from '@api/schemas/article.schema';

const UNIQUE_SUFFIX_LENGTH = 5;
const DEFAULT_TAGS_COUNT = 2;

function generateUniqueSuffix(): string {
    return faker.string.alphanumeric({ length: UNIQUE_SUFFIX_LENGTH, casing: 'lower' });
}

// 1 - Create ------------------------------------------------------------------------------

export function generateCreateArticleData(overrides?: Partial<CreateArticlePayload>): CreateArticlePayload {
    return {
        title: `${faker.book.title()}-${generateUniqueSuffix()}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        tagList: faker.helpers.uniqueArray(() => faker.word.sample().toLowerCase(), DEFAULT_TAGS_COUNT),
        ...overrides,
    }
}

export function generateCreateArticlePayload(overrides?: Partial<CreateArticlePayload>): CreateArticleRequest {
    return {
        article: generateCreateArticleData(overrides),
    }
}

// 2 - Update ------------------------------------------------------------------------------

export function generateUpdateArticleData(overrides?: Partial<UpdateArticlePayload>): UpdateArticlePayload {
    return {
        title: `updated-${faker.book.title()}-${generateUniqueSuffix()}`,
        description: `Updated description: ${faker.lorem.sentence()}`,
        body: `Updated body: ${faker.lorem.paragraphs()}`,
        ...overrides,
    }
}

export function generateUpdateArticlePayload(overrides?: Partial<UpdateArticlePayload>): UpdateArticleRequest {
    return {
        article: generateUpdateArticleData(overrides),
    }
}