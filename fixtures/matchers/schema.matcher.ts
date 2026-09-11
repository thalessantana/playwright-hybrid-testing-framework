import { expect as baseExpect } from "@playwright/test";
import { z } from "zod";

type SchemaTarget = z.ZodType | Record<string, z.ZodType>;

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toMatchSchema(schema: SchemaTarget): R;
    }
  }
}

/**
 * Extended Playwright `expect` with the custom `toMatchSchema` matcher for Zod-based contract validation.
 */
export const expect = baseExpect.extend({
  /**
   * Validates that the received payload matches the given Zod schema.
   * @param received - The actual API response payload.
   * @param target - A Zod schema or a `{ SchemaName: ZodSchema }` record.
   * @returns A matcher result indicating pass/fail with formatted Zod errors on failure.
   */
  toMatchSchema(received: unknown, target: SchemaTarget) {
    let schema: z.ZodType;
    let schemaName: string;

    if (target instanceof z.ZodType) {
      schema = target;
      schemaName = schema.description ?? "AnonymousSchema";
    } else {
      const keys = Object.keys(target);
      schemaName = keys[0];
      schema = target[schemaName];
    }

    const result = schema.safeParse(received);

    if (result.success) {
      return {
        message: () =>
          `Contract validation passed: response matches [${schemaName}]`,
        pass: true,
      };
    }

    const formattedErrors = JSON.stringify(result.error.format(), null, 2);
    return {
      message: () =>
        `Schema Contract Violation for [${schemaName}]:\n${formattedErrors}`,
      pass: false,
    };
  },
});
