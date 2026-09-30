// Shapes the admin API returns. Only the admin page uses them, so they stay out of @repo/shared.

export type AdminStory = {
  id: string;
  slug: string;
  headline: string;
  section: string;
  slot: "lead" | "feature" | "brief";
  page: number;
  isReserve: boolean;
  /** ISO timestamp; set only on pulled stories. */
  pulledAt: string | null;
  pulledReason: string | null;
};

export type AdminEdition = {
  issueNumber: number;
  date: string;
  status: "draft" | "scheduled" | "published" | "pulled";
  kind: "regular" | "slow_news_day";
  design: string;
  /** What readers get, in page order. */
  stories: AdminStory[];
  reserves: AdminStory[];
  /** Taken out by the admin; kept so they can be restored. */
  pulled: AdminStory[];
};

/** One row of the audit log. */
export type AdminAction = {
  id: string;
  action: string;
  issue: number | null;
  slug: string | null;
  detail: unknown;
  at: string;
};
