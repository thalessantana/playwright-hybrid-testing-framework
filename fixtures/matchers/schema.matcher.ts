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

export const expect = baseExpect.extend({
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
        `Schema Contract Violation for [${schemaName}]:\n${formattedErrors}\n\nReceived payload:\n${JSON.stringify(received, null, 2)}`,
      pass: false,
    };
  },
});
