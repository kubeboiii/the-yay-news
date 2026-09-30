import { permanentRedirect } from "next/navigation";

/** Back issues moved to Your Pile; old links (and their `?cursor=`) still land in the right place. */
export default async function ArchivePage({ searchParams }: PageProps<"/archive">) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const qs = params.toString();
  permanentRedirect(qs ? `/pile?${qs}` : "/pile");
}
