# The Yay News — Project Plan

> A finishable daily newspaper of only good, fun, weird and interesting things.
> Loud as a poster zine, readable as a newspaper, written by an automated newsroom.

Status: **planning** · Last updated: 2026-09-29

---

## 1. The idea in one paragraph

Every morning a new edition of _The Yay News_ lands, at 7am in each reader's own timezone. It is about
15 items and 10 minutes long, laid out as real newspaper pages rather than a feed, and it **ends**: the
back page says you're done for today. Everything in it is enjoyable — releases, discoveries, great
sport moments, clever tech, delightful internet — and nothing in it is grim. A fully automated pipeline
finds, filters, writes and lays out each edition; people share stories as designed newspaper clippings.

## 2. Principles

These settle arguments later. When a feature conflicts with one, the principle wins.

1. **Finishable, not infinite.** A fixed-size edition with a back page is the product. No endless feed,
   no "recommended for you" rail, no autoplay.
2. **Delight, not positivity.** The bar is _would a reader enjoy this?_, not _is this uplifting?_ A
   brilliant overtake, a strange deep-sea creature and an absurd Reddit thread all qualify.
3. **Absolutely no bad news.** No tragedy, conflict, politics, health scares, crime, disasters,
   layoffs, market fear or drama — not even told constructively. When unsure, leave it out.
4. **Curated, never aggregated.** Every item is our own short write-up with a credited link to the
   source. We never republish someone else's article or photo.
5. **Grounded.** The newsroom may only state what its source says. A funny headline is fine; an
   invented fact is not.
6. **Zine on top, newspaper underneath.** Loud where it's glanced at, calm where it's read.

## 3. Decisions made

| Topic              | Decision                                                                        |
| ------------------ | ------------------------------------------------------------------------------- |
| Name               | **The Yay News**                                                                |
| Audience           | Global, English                                                                 |
| Content production | **Fully automated** pipeline, with an emergency pull/replace control            |
| AI provider        | Decide later — behind one provider-neutral interface                            |
| Reading format     | Newspaper pages: front page → inside pages → back page, stacked on mobile       |
| Release time       | 07:00 in each reader's local timezone; same edition for everyone                |
| Edition size       | Compact: ~15 items, ~10 minutes                                                 |
| Voice              | Mix, varying by section (see §5)                                                |
| Content edges      | None allowed: no serious topics at all, including "constructive" ones           |
| Images             | Openly licensed photos first, generated illustrations as fallback               |
| Visual direction   | **Loud poster zine** (Newspaper Club-led), with readable body text              |
| Goal               | Grow an audience                                                                |
| Features           | Puzzles, newsletter, shareable clippings + PDF, native share flows              |
| Accounts           | None at launch; Google sign-in later, merging on-device history                 |
| Mobile app         | **Web only**                                                                    |
| Extra sections     | A rotating guest section every other day                                        |
| Hosting            | Vercel (frontend) + small container host (backend, pipeline) + managed Postgres |
| Budget             | **Under $25/month** at launch                                                   |
| First milestone    | **Reader first**, on hand-made sample editions                                  |

## 4. Sections

### Core sections (appear most days)

| Section                | What goes in                                                                  | Notes                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Screen & Sound**     | Shows, movies, trailers, casting, releases, concerts, albums                  | Trailers embedded, never re-hosted                                                    |
| **Gaming**             | PC and console releases, indie gems, big updates, gaming culture              | Press-kit images are usable for coverage                                              |
| **Sports**             | Standout moments from F1, cricket, football, MMA and others                   | Not every sport every day; results only when the _story_ is fun                       |
| **Tech**               | Cool products, AI, startups, open-source projects, clever engineering         | Balance rule stops it becoming an AI section                                          |
| **Discoveries**        | Space, animals, plants, science finds                                         | NASA and similar sources are public-domain-friendly for images                        |
| **Money**              | Only clearly fun economics & finance: records, quirky economics, big launches | No market moves, no downturns, no fear. Rejected if it isn't unambiguously delightful |
| **Internet & Culture** | Great posts, Substacks, blogs, Reddit finds, viral moments                    | Posts are **embedded** (oEmbed), not copied                                           |

### Rotating guest sections (one, every other day)

- **Food & Words** — a weird food or recipe of the day; word of the day, odd etymologies, untranslatable words
- **On This Day & 100 Years Ago** — fun firsts, odd inventions and patents, strange century-old headlines
- **Art, Design & Books** — a poster, building, typeface or clever ad; one book or long-read worth your time
- **Reader-made** — Small Wins, Letters to the Editor, Classifieds (needs submissions; see Phase 6)

**Rotation rule:** on alternating issues, one guest section takes a slot. The order is a seeded shuffle
of the list per cycle, keyed by issue number, so it _feels_ random but each section appears once per
cycle, never twice in a row, and any given issue always gets the same one.

### Recurring features (fixed slots)

- **Number of the Day** — one surprising figure, set enormous on the front page
- **The Internet Weather Report** — the day's online mood as a forecast ("sunny, with scattered memes")
- **Classifieds** — free fake-but-real "ads" for indie games, open-source projects and small creators
- **Corrections** — a joke column ("Yesterday we said otters hold hands. They hold hands _more_ than we said.")
- **Puzzles** — back page (see §7)
- **Comic strip** — a small recurring strip (later phase)

## 5. Voice

The tone changes by section, the way a real paper's does.

| Where                                                              | Tone                                                                                    |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Front page, core section briefs                                    | **Witty but informative** — clear facts, a playful headline, at most one joke per brief |
| Corrections, Classifieds, Weather Report, puzzle clues, columnists | **Full quirky** — puns, absurd asides, running gags                                     |
| Discoveries (animals, nature), human stories, Small Wins           | **Warm and gentle**                                                                     |

A written voice guide lives beside the newsroom's prompts: banned phrases ("heartwarming", "you won't
believe"), headline patterns, brief length (60–120 words), and examples of each tone.

## 6. Edition structure

About 15 items, arranged as pages:

| Page                  | Contents                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Front page**        | Masthead, date, `Vol. 1 · No. 42`, lead story, Number of the Day, Weather Report, "Inside today" index     |
| **Inside pages (≈6)** | Core sections, 1–3 stories each depending on the day; a guest section every other day                      |
| **Back page**         | Puzzles, Corrections, Classifieds, comic, and the sign-off: _"You're done for today. See you tomorrow ☀️"_ |

- **Weekly rhythm (later):** a rotating focus day (e.g. Monday tech deep-dive, Friday gaming and
  weekend plans). Sunday stays the same size at launch; a bigger Sunday edition is a later option.
- **Issue numbers** run continuously from launch and never reset.
- **Back issues:** past editions stay browsable by date in an archive laid out like a newsstand rack.
- **Every story has its own URL**, so it can be shared and indexed, and every page links back into the
  edition it belongs to.

### Release timing

There is one edition per date, and a reader sees edition _D_ once it is 07:00 on _D_ where they are.

- The client reports its IANA timezone (a cookie set on first visit); the server picks the newest
  edition whose local release moment has passed. Unknown timezone falls back to UTC.
- The earliest timezone (UTC+14) reaches 07:00 at 17:00 UTC the previous day, so **edition D must be
  published by 16:00 UTC on D−1**. The pipeline runs around 10:00 UTC to leave room for retries.
- Before release, an edition exists but is not served. After the next edition releases, it becomes a
  back issue.

## 7. Reader features

### Sharing

Each platform should open its **own native composer**, not a generic share action.

| Platform                           | Mechanism                                        | Opens native composer                                                                                          |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| X / Twitter                        | `x.com/intent/post?text=…&url=…`                 | Yes                                                                                                            |
| Threads                            | `threads.net/intent/post?text=…`                 | Yes                                                                                                            |
| Facebook                           | `facebook.com/sharer/sharer.php?u=…`             | Yes                                                                                                            |
| WhatsApp                           | `wa.me/?text=…`                                  | Yes                                                                                                            |
| Reddit                             | `reddit.com/submit?url=…&title=…`                | Yes                                                                                                            |
| LinkedIn                           | `linkedin.com/sharing/share-offsite/?url=…`      | Yes                                                                                                            |
| Telegram                           | `t.me/share/url?url=…&text=…`                    | Yes                                                                                                            |
| Pinterest                          | `pinterest.com/pin/create/button/?url=…&media=…` | Yes                                                                                                            |
| **Instagram Story / Post (phone)** | Web Share API with our clipping image file       | **One extra tap**: reader picks Instagram in the share sheet, then Instagram's own editor opens with the image |
| Instagram (desktop)                | none exists                                      | No — offer "Download image" and a QR code to continue on the phone                                             |
| Copy link / Email                  | clipboard / `mailto:`                            | —                                                                                                              |

**Why Instagram is different:** Meta's native "Sharing to Stories" flow exists only for native iOS and
Android apps (a pasteboard or intent plus a Facebook App ID). A website cannot invoke it. With a web-only
product, the share sheet is the closest achievable flow; one-tap Instagram Stories would require a
native app, which is out of scope.

### Clippings

Every story, the front page and the day's puzzle can be rendered as a designed newspaper clipping —
torn edge, masthead, date, issue number — in three formats:

- **1080×1920** for Stories
- **1080×1350** for feed posts
- **1200×630** as the link preview image, so links shared anywhere look like a clipping too

Rendered server-side on demand and cached.

### Printable edition

Each edition downloads as a PDF laid out as a real broadsheet, a nod to the print references.

### Puzzles (back page)

Generated in code, so they are free and never repeat: a mini crossword, a word game, and a riddle.
Answers are revealed in the next day's edition. Spot-the-difference is a later option.

### Habits, without accounts

- **Streaks** and **collectible daily stamps** (read an edition, collect its stamp) stored **on the
  device**. After a month you have a stamp book.
- **Saved stories** stored on the device too.
- Stored in a shape that a later Google sign-in can **merge** into an account rather than discard.

### Newsletter

The front page delivered each morning, with double opt-in and one-click unsubscribe. It needs an email
address, not an account.

## 8. Design direction

The **loud poster zine** from the Newspaper Club references: saturated colour pages, giant condensed
headlines, stickers and badges, newsprint texture, minimal photography.

**The readability rule:** each page's top half is full zine — a solid colour block, a huge headline and a
sticker. The briefs underneath sit on newsprint off-white in a readable serif. Body text never sits on a
saturated background, and every text/background pair must meet WCAG AA contrast.

Borrowed accents:

- From **Happy News**: hand-drawn doodles and "Did you know…" fact cards, used sparingly on fun pages
- From **Positive News**: the column grid and the "In brief" pattern for inside pages

Deliverables in Phase 1: masthead, type pairing (a heavy condensed display face plus a readable serif),
per-section colour palette, stickers and badges, doodle set, and the clipping templates.

Because the style is typographic, stories rarely _need_ a photo — which is also what keeps images
within budget.

## 9. The automated newsroom

A scheduled job that builds each edition. Stages run in order, and every decision is recorded so a bad
edition can be explained afterwards.

1. **Gather** candidates from an allowlist of sources: RSS feeds, Reddit, YouTube channels, and
   game, tech and space APIs. Each source is tagged with the sections it can feed.
2. **Filter — the delight check.** A deterministic blocklist runs first, then a model classifier
   against a written rubric. It returns allow or reject **with a reason**. Anything uncertain is
   rejected; a false reject costs nothing, a false allow costs trust.
3. **Dedup** against recent editions and against each other (the same story from three outlets).
4. **Select** ~15 items plus **reserves**, under balance rules: section quotas, no single topic
   dominating (the "not 12 AI stories" rule), variety of sources, a strong candidate for the lead.
5. **Write** each brief from the fetched source text only, in the section's voice. A deterministic
   check then verifies that every number and proper noun in the brief appears in the source; a brief
   that fails is rewritten or replaced by a reserve.
6. **Illustrate.** Use an openly licensed image when one exists (NASA, Wikimedia Commons, Unsplash,
   Pexels, official press kits), always with credit and licence recorded. Otherwise use a generated
   illustration or the typographic treatment. No image without a recorded licence is ever published.
7. **Generate** the recurring features: Number of the Day, Weather Report, puzzles, Corrections.
8. **Lay out** stories onto pages and **publish** the edition, scheduled for its local-time release.

**When things go wrong:**

- A failed stage retries. A story that can't pass is replaced from reserves.
- If the pipeline cannot produce an edition, it publishes a **"Slow News Day"** edition from a bank of
  evergreen items — on brand, and never a blank front page.
- **Emergency control:** a small password-protected admin page to pull a story (auto-replaced from
  reserves), replace an edition, or roll back to the previous one. It is not a newsroom: nothing
  requires daily human action.

**Model use:** the provider is swappable behind one interface. Cheap models do filtering and
classification; a better model writes the briefs. Batch the day's work into as few calls as possible.

**Sources to be careful with:**

- X/Twitter's API is expensive, so posts are found via other sources and **embedded** via oEmbed.
- Reddit and other platforms have API terms that must be followed; respect `robots.txt` and rate limits.

## 10. Architecture

Built on the existing monorepo (pnpm + Turborepo, Next.js 16 + Tailwind v4, Hono, PostgreSQL + Prisma 7).

```
apps/
  frontend/     Next.js reader: editions, pages, stories, archive, share, clippings, PDF
  backend/      Hono API: editions, stories, newsletter, admin controls
  newsroom/     NEW — the scheduled pipeline (gather → filter → select → write → publish)
packages/
  db/           Prisma schema + client
  shared/       zod contracts shared by all three apps
  ui/           shared zine design-system components
```

The frontend reads only through the backend API; the newsroom writes through `@repo/db`.

### Data model (first cut)

The current demo `Article` / `Category` models are replaced by:

| Model         | Key fields                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Edition`     | `date` (unique), `issueNumber` (unique), `status` (`draft` · `scheduled` · `published` · `pulled`), `kind` (`regular` · `slow_news_day`), `guestSection?` |
| `Page`        | `edition`, `order`, `section`, `layout`                                                                                                                   |
| `Story`       | `page`, `order`, `slot` (`lead` · `brief` · …), `headline`, `body`, `section`, `sourceUrl`, `sourceName`, `embedUrl?`, `isReserve`                        |
| `Image`       | `story`, `url`, `credit`, `licence`, `licenceUrl`, `kind` (`photo` · `illustration`)                                                                      |
| `Section`     | `slug`, `name`, `kind` (`core` · `guest`), `colour`, `voice`                                                                                              |
| `Puzzle`      | `edition`, `type`, `data` (JSON), `solution` (JSON)                                                                                                       |
| `Feature`     | `edition`, `type` (`number_of_day` · `weather` · `correction` · `classified`), `content`                                                                  |
| `Source`      | `name`, `url`, `type`, `sections`, `enabled`                                                                                                              |
| `Candidate`   | `source`, `url`, `fetchedAt`, `decision`, `decisionReason`, `run`                                                                                         |
| `PipelineRun` | `edition`, `startedAt`, `finishedAt`, `status`, `log`                                                                                                     |
| `Subscriber`  | `email` (unique), `confirmedAt?`, `unsubscribedAt?`, `timezone`                                                                                           |

### Hosting and costs (estimates at launch)

| Piece                  | Where                                         | Est. monthly |
| ---------------------- | --------------------------------------------- | ------------ |
| Frontend               | Vercel Hobby                                  | $0           |
| Backend + newsroom job | Railway / Fly / Render small instance         | ~$5          |
| Postgres               | Neon or Supabase free tier                    | $0           |
| AI                     | Cheap models, batched once a day              | ~$3–10       |
| Images                 | Licensed first; a few generated illustrations | ~$0–5        |
| Email                  | Resend free tier (100/day, 3,000/month)       | $0           |
| **Total**              |                                               | **~$8–20**   |

Two thresholds to watch:

- **Email** is the first real cost. A daily newsletter outgrows the free tier at about **100
  subscribers**; the next tier is about $20/month.
- **Vercel Hobby is for non-commercial use.** Adding sponsorships or ads means moving to Pro (~$20/month).

## 11. Roadmap

Reader first, on hand-made sample editions; automation after the reading experience is right.

### Phase 1 — Brand and design system

- Masthead, type pairing, per-section palette, stickers, badges, doodle set
- Zine page components in `packages/ui`, following the readability rule
- Clipping templates in all three formats

**Done when:** a static sample front page and inside page look right on desktop and mobile, pass AA
contrast, and a clipping renders for a sample story.

### Phase 2 — Reader MVP

- New data model; 3–5 hand-made sample editions seeded
- Front page, inside pages, story pages, back page, "you're done for today"
- Archive of back issues by date
- Local-time release logic
- Share bar: native composers for every platform in §7; Instagram via the share sheet with a clipping
  image; download and QR on desktop
- Printable PDF edition
- Per-story link previews using the 1200×630 clipping

**Done when:** a reader in any timezone gets the right edition at 07:00, can read it to the back page,
browse back issues, and share any story to each platform's composer.

### Phase 3 — Puzzles and habits

- Generated mini crossword, word game and riddle, with answers in the next edition
- On-device streaks, stamps and saved stories, stored mergeably

**Done when:** each sample edition has a playable back page, and a streak survives a reload.

### Phase 4 — The automated newsroom

- `apps/newsroom` with the eight stages in §9
- Source allowlist, delight check, dedup, balance rules, grounded writing with the fact check
- Image licensing, reserves, Slow News Day fallback, emergency admin page
- Provider-neutral model interface; pick the provider here

**Done when:** a full week of editions publishes on schedule with no human action, every image has a
recorded licence, and a planted grim story is rejected by the delight check.

### Phase 5 — Newsletter

- Double opt-in signup, a morning email of the front page, one-click unsubscribe

**Done when:** a subscriber receives each edition's email in their morning.

### Phase 6 — Later

- Google sign-in, merging on-device streaks, stamps and saved stories
- Reader submissions for Small Wins, Letters and Classifieds, with automatic moderation
- Weekly focus days and a bigger Sunday edition
- Comic strip, spot-the-difference
- A monthly printed compilation

## 12. Risks

| Risk                                                            | Mitigation                                                                                                                   |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Something grim or wrong slips through with no human in the loop | Reject-when-unsure filter, grounded writing with a deterministic fact check, emergency pull/replace, every decision recorded |
| Copyright on text or images                                     | Own write-ups only, credited links, embeds instead of copies, a recorded licence required for every image                    |
| Editions feel samey or AI-heavy                                 | Balance rules, section quotas, dedup across days, rotating guest sections                                                    |
| Pipeline fails on a given day                                   | Retries, reserves, the Slow News Day edition                                                                                 |
| Too thin on bad-news-free days in a section                     | Sections are 1–3 stories, not fixed; a section can skip a day                                                                |
| The zine look hurts readability                                 | The readability rule and AA contrast checks on every page                                                                    |
| Costs outgrow the budget                                        | Cheap models batched daily; watch the email and Vercel thresholds                                                            |
| Source API terms change or cost money                           | Allowlist is data, not code; no dependency on the X API                                                                      |

## 13. Open questions

None of these block Phase 1.

- Domain name and social handles
- Analytics — a privacy-friendly option such as Plausible or Umami
- The masthead lettering itself, and the mascot (if any)
- AI provider (decided in Phase 4)
- The exact source allowlist (drafted at the start of Phase 4)
- Whether the rotating guest section ever gets its own fixed day
