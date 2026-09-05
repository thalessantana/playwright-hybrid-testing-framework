import { faker } from '@faker-js/faker';
import { CreateArticleRequest, ArticlePayload } from '../types/article.types';

export function generateCreateArticleData(overrides?: Partial<ArticlePayload>): ArticlePayload {
    const uniqueSuffix = faker.string.alphanumeric(5);

    return {
        title: `${faker.book.title()}_${uniqueSuffix}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        ...overrides,
    }
}

export function generateCreateArticlePayload(overrides?: Partial<ArticlePayload>): CreateArticleRequest {
    return {
        article: generateCreateArticleData(overrides),
    }
}