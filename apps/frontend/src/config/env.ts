import "server-only";
import { z } from "zod";

// Parsed once at startup so a missing or malformed variable fails loudly, not on first request.
export const env = z
  .object({
    BACKEND_URL: z.url().default("http://localhost:4000"),
    /** Where the reader is served, for absolute links in share URLs and link previews. */
    SITE_URL: z.url().default("http://localhost:3000"),
  })
  .parse(process.env);
