import { loadSite } from "@/app/mockups/site-a/_shared/data";
import { PrintedPaper } from "@/app/mockups/site-a/_shared/paper";
import { Mascot, Tracklist } from "@/features/riot";
import { Shell } from "../_ui/chrome";

const href = (order: number) => `/mockups/site-b/today?p=${order}`;

export default async function Today({ searchParams }: PageProps<"/mockups/site-b/today">) {
  const data = await loadSite(searchParams);
  const sp = await searchParams;
  const pages = data.pages.map((p) => ({ ...p, href: href(p.order) }));
  const order = Math.min(Math.max(Number(sp.p) || 1, 1), pages.length);
  return (
    <Shell
      data={data}
      place="today"
      note="Reading is calm: the paper on plain stock, nothing loud behind it. The page-turner is a mixtape J-card docked to the bottom, every page a track, the next one named on the biggest button. ← → keys too."
    >
      <div className="sb-reading">
        <PrintedPaper edition={data.edition} order={order} />
      </div>
      <Tracklist
        pages={pages}
        current={order}
        read={pages.filter((p) => p.order < order).map((p) => p.order)}
        doneHref="/mockups/site-b/done"
        sideNote={`No. ${data.edition.issueNumber}`}
        mascot={<Mascot pose="deliver" label="" />}
      />
    </Shell>
  );
}
