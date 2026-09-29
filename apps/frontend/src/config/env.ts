import "server-only";
import { z } from "zod";

// Parsed once at startup so a missing or malformed variable fails loudly, not on first request.
export const env = z
  .object({
    BACKEND_URL: z.url().default("http://localhost:4000"),
  })
  .parse(process.env);
