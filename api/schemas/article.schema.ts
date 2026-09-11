import { z } from "zod";
import { ProfileResponseDataSchema } from "./user.schema";

// 1 - Requests ---------------------------------------------------------------------------

export const CreateArticlePayloadSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  body: z.string().min(1, "Body cannot be empty"),
  tagList: z.array(z.string()).optional(),
});

export const CreateArticleRequestSchema = z.object({
  article: CreateArticlePayloadSchema,
});

export const UpdateArticlePayloadSchema = z.strictObject(
  CreateArticlePayloadSchema.omit({ tagList: true }).partial().shape,
);

export const UpdateArticleRequestSchema = z.object({
  article: UpdateArticlePayloadSchema,
});

// 2 - Responses --------------------------------------------------------------------------

export const ArticleResponseDataSchema = CreateArticlePayloadSchema.extend({
  slug: z.string().min(1, "Slug cannot be empty"),
  tagList: z.array(z.string()),
  createdAt: z.iso.datetime({
    message: "CreatedAt must be a valid ISO datetime",
  }),
  updatedAt: z.iso.datetime({
    message: "UpdatedAt must be a valid ISO datetime",
  }),
  favorited: z.boolean(),
  favoritesCount: z.number().int().nonnegative(),
  author: ProfileResponseDataSchema,
});

export const ArticleResponseSchema = z.object({
  article: ArticleResponseDataSchema,
});

export const ArticlesResponseSchema = z.object({
  articles: z.array(ArticleResponseDataSchema),
  articlesCount: z.number().int().nonnegative(),
});

// 3 - Inferred Types ---------------------------------------------------------------------

export type CreateArticlePayload = z.infer<typeof CreateArticlePayloadSchema>;
export type CreateArticleRequest = z.infer<typeof CreateArticleRequestSchema>;
export type UpdateArticlePayload = z.infer<typeof UpdateArticlePayloadSchema>;
export type UpdateArticleRequest = z.infer<typeof UpdateArticleRequestSchema>;
export type ArticleResponseData = z.infer<typeof ArticleResponseDataSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type ArticlesResponse = z.infer<typeof ArticlesResponseSchema>;
