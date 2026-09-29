import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { z } from "zod";
import { ValidationError } from "./errors.js";

/** zod validation that reports failures in the API's standard error shape. */
export const validate = <T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) throw new ValidationError(z.flattenError(result.error));
  });
