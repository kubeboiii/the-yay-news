// Shapes the admin API returns. Only the admin page uses them, so they stay out of @repo/shared.

export type AdminStory = {
  id: string;
  slug: string;
  headline: string;
  section: string;
  slot: "lead" | "feature" | "brief";
  page: number;
  isReserve: boolean;
};

export type AdminEdition = {
  issueNumber: number;
  date: string;
  status: "draft" | "scheduled" | "published" | "pulled";
  kind: "regular" | "slow_news_day";
  design: string;
  stories: AdminStory[];
  reserves: AdminStory[];
};
