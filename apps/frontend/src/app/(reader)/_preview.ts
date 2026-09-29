import { editionDesignSchema } from "@repo/shared";
import type { Preview } from "@/features/editions/api";

/** Preview parameters, honoured outside production only (see Preview). */
export async function previewFrom(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
): Promise<Preview> {
  if (process.env.NODE_ENV === "production") return {};
  const { now, design } = await searchParams;
  const parsed = editionDesignSchema.safeParse(design);
  return {
    ...(typeof now === "string" && { now }),
    ...(parsed.success && { design: parsed.data }),
  };
}
