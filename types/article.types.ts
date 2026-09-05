export interface ArticlePayload {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
}

export interface CreateArticleRequest {
    article: ArticlePayload;
}