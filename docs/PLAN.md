# The Yay News — Project Plan

> A finishable daily newspaper of only good, fun, weird and interesting things.
> Loud as a poster zine, readable as a newspaper, written by an automated newsroom.

Status: **planning** · Last updated: 2026-09-29

---

## 1. The idea in one paragraph

Every morning a new edition of _The Yay News_ lands, at 7am in each reader's own timezone. It is about
30 items and 15 minutes long, laid out as real newspaper pages rather than a feed, and it **ends**: the
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

| Topic              | Decision                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Name               | **The Yay News**                                                                           |
| Audience           | Global, English                                                                            |
| Content production | **Fully automated** pipeline, with an emergency pull/replace control                       |
| AI provider        | **Claude Code CLI** (subscription) primary, **Gemini Flash free tier** fallback            |
| Reading format     | Newspaper pages: front page → inside pages → back page, stacked on mobile                  |
| Release time       | 07:00 in each reader's local timezone; same edition for everyone                           |
| Edition size       | A full paper: ~30 items, ~15 minutes (revised 2026-09-30; ~15 read too thin)               |
| Voice              | Mix, varying by section (see §5)                                                           |
| Content edges      | None allowed: no serious topics at all, including "constructive" ones                      |
| Images             | Openly licensed photos first, generated illustrations as fallback                          |
| Visual direction   | **Loud poster zine** (Newspaper Club-led), with readable body text                         |
| Designs            | **Broadsheet on weekdays**; at weekends one of Tabloid, Mini Zine or Midi Magazine         |
| Goal               | Grow an audience                                                                           |
| Features           | Puzzles, newsletter, shareable clippings + PDF, native share flows                         |
| Accounts           | None at launch; Google sign-in later, merging on-device history                            |
| Mobile app         | **Web only**                                                                               |
| Daily lineup       | Front, Tech, Startups, Screen, Play, Music, Money, Sports, Internet, Discoveries (2026-10) |
| Guest sections     | 28 guests, **two a day**, seeded by date: each once per 14-day cycle (2026-10)             |
| Weekends           | Saturday "The Big Weekend" and Sunday "The Scrapbook" lineups (2026-10)                    |
| Beats              | Each section has weighted beats; a page spreads across them and rotates (2026-10)          |
| Hosting            | Vercel (frontend) + small container host (backend, pipeline) + managed Postgres            |
| Budget             | **Under $25/month** at launch                                                              |
| First milestone    | **Reader first**, on hand-made sample editions                                             |

## 4. Sections

### Daily sections (every weekday, in this order)

| Section         | What goes in                                                                   | Beats (data/beats.json)                                                                   |
| --------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Tech**        | Gadgets, AI, software, science-tech, clever engineering                        | gadgets, ai, software, internet-infra, robots                                             |
| **Startups**    | Launches, funding, founders, Product Hunt / Show HN finds, Indian startups     | funding, launches, founders, india-startups                                               |
| **Screen**      | Films, TV, anime, trailers, streaming                                          | movies, tv, anime, trailers, streaming                                                    |
| **Play**        | Games (console, PC, mobile, indie, fun esports) and comics                     | console, pc, mobile, indie, esports-fun, comics                                           |
| **Music**       | Albums, singles, tours, concerts, festivals, artists                           | albums, singles, tours, festivals, artists, india-music                                   |
| **Money**       | Finance, economy, markets, business: only the fun kind                         | markets, economy, personal-finance-fun, business-oddities                                 |
| **Sports**      | Football first, then UFC/MMA, boxing, F1, tennis, cricket, basketball, running | football, ufc-mma, boxing, f1, tennis, cricket, basketball, running, olympics, odd-sports |
| **Internet**    | Memes, creators, viral moments, lifestyle, and odd news                        | memes, social, creators, viral, odd-news, lifestyle                                       |
| **Discoveries** | Space, animals, plants, physics, chemistry, biology, the Earth, the oceans     | space, animals, plants, physics, chemistry, biology, earth, oceans                        |

Every daily page runs with at least three stories (main, second, brief). A page short of stories pulls
from its sources' secondary sections, then bends the edition-wide topic and source caps for itself.
Posts are embedded (oEmbed), never copied; trailers are embedded, never re-hosted.

**Beats.** The classifier tags each candidate with a section and a beat in the same batched call.
Within a section the select stage diversifies beats first (no second story from a beat while another
beat still has a candidate), lifts beats unseen in the last seven days of editions (read back from
each run's log, since stories have no beat column), and gives weighted beats a small nudge.

### Rotating guest sections (two a day)

Brain Snacks (fun facts, GK, how things work) · Time Machine (on this day, 100 years ago) · Dig Site
(archaeology, lost things found) · Tiny Science (small studies, fun results) · Word Nerd (word of the
day, etymology, slang) · Food & Drink · Art & Design · Books & Comics Shelf · Fashion & Sneakers ·
Postcards (travel, strange places, festivals) · Good Humans · India Desk · Planet Wins (nature and
clean-energy good news) · Animal Kingdom (zoos, wild animals) · World Records · Nostalgia Corner
(2000s/2010s) · Myth Busters · Future Stuff · Your Small Wins (real small-win stories, labelled; reader
submissions later) · Letters & Classifieds (clearly playful) · Feel Good Health (no illness framing) ·
Wheels · Creator Economy · Pets Corner · Weird Laws & Local · Kids & Schools · Weird Jobs · Homes &
Buildings.

**Rotation rule:** two guest pages a day, between Discoveries (or the weekend pages) and the back
page. The order is a seeded shuffle of all 28 per 14-day cycle, keyed by date, so each guest appears
exactly once per cycle; a cycle never opens with the guest that closed the last one, nor repeats any
of the previous cycle's pairs in the same order. A guest that cannot fill three stories gives way to
the next guest in its cycle.

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

About 35–45 items, arranged as pages. Each inside page carries a main story, a second story and a
column of short briefs; every story appears once, and the only page-to-page index is the front page's
"Inside today".

**Weekdays (broadsheet), 13 pages:**

| Page                | Contents                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Front page**      | Masthead, date, `Vol. 1 · No. 42`, lead story, Number of the Day, Weather Report, "Inside today" index     |
| **Daily pages (9)** | Tech · Startups · Screen · Play · Music · Money · Sports · Internet · Discoveries, ≥3 stories each         |
| **Guest pages (2)** | Two of the 28 guests (§4)                                                                                  |
| **Back page**       | Puzzles, Corrections, Classifieds, comic, and the sign-off: _"You're done for today. See you tomorrow ☀️"_ |

**Saturday, "The Big Weekend"** (tabloid, zine or midi): front (a big photo splash) · The Week in 10
(ten short re-tellings of the best stories from Monday to Friday, each linking to its original story
and reusing its picture) · Weekend Guide (what to watch, stream and hear; gigs and festivals) · Sports
Weekend (the weekend's matches, fights and races previewed; never odds or betting) · Deep Dive (one
five-minute feature written from several outlets, all named in its credit; every other story takes its facts from its one source) · two guest pages · back page (puzzles).

**Sunday, "The Scrapbook"**: front ("The Week in Pictures") · Photo Album (the week's best pictures,
one per story, linking to the stories) · Hall of Fame (the week's best animal, human hero, weird record
and internet moment) · Slow Read (a relaxed long read) · Make & Do (a recipe, a make, a playlist, a
doodle prompt) · Next Week (releases, launches and events coming up) · two guest pages · back page with
the 9×9 Sunday crossword.

At weekends the daily sections' sources feed the weekend pages (newsroom `WEEKEND_FEEDS`); the Week
in 10, Photo Album and Hall of Fame are built from the past week's editions in the database.

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

### The website around the paper

Decided 2026-10-01. The paper is the product; the site is its doorstep, and it adds nothing a real
paper wouldn't have except where the web beats paper (resuming, sharing, keeping things). Three
places, and a pager for the paper itself:

| Place                   | What it holds                                                                                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Today** (`/`)         | Today's paper, behind a front door that changes with the day: before 07:00 the shutter is half up with a countdown and yesterday's paper underneath; the paper drops in once per issue; once it's finished the shop is **closed till 7**, with the reader's receipt to share. |
| **Your Pile** (`/pile`) | Every paper so far: unfinished ones from the last week on top, this week's rack, earlier months in boxes, a stamp calendar, search, and the paper from your birthday. Each copy carries the reader's mark (stamped, stamped late, dog-eared).                                 |
| **Your Wall** (`/wall`) | Everything kept: clippings, the stamp book, cards, stickers, the weekly dump and month in Yay, and a code to move it all to a new phone.                                                                                                                                      |

- **The site bar** (every page): the masthead mark, today's date (opens the stamp calendar), Today,
  Pile, Wall. It tucks away while reading.
- **The pager** (every page of the paper): ‹ Page 4 of 13 · Music ›, an edge that fills as you read,
  and a grid of every page. On the back page its last step is the fold: "N pages to go", then
  "Fold it", which closes up shop.
- **Stories** opened inside the paper slide up in a sheet over the page; opened on their own (a shared
  link, a search) they end with a strip about the paper and more headlines from it.
- **Pass it on**: send a story with a note scribbled on it; the note travels in the link.
- **Older papers** carry a "From the pile" band, so nobody mistakes one for this morning's.
- **Offline**: papers you've opened keep reading without a connection; after three finished papers
  the closed shutter offers to put the paper on the home screen.
- A late read earns a stamp in a different ink; the streak counts papers by their printed date, so
  catching up on yesterday's still counts.

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
4. **Select** ~30 items plus **reserves**, under balance rules: section quotas, no single topic
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
Decided in Phase 4 (2026-09-30): the primary provider is the local **Claude Code CLI** in print mode
(Haiku for the cheap tier, Sonnet for the writer), which runs on the existing subscription with no API
key or per-call cost; the fallback is **Google Gemini Flash on the free tier** over REST. A failing
provider hands each call to the next automatically, and a deterministic fake model serves tests.

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

| Model          | Key fields                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Edition`      | `date` (unique), `issueNumber` (unique), `status` (`draft` · `scheduled` · `published` · `pulled`), `kind` (`regular` · `slow_news_day`), `design`, `colourway`, `guests`                   |
| `EditionGuest` | `edition`, `section`, `order`: the day's guest sections (two on a normal day) in page order; the API serves them as `guestSections`, with `guestSection` (the first) kept for older clients |
| `Page`         | `edition`, `order`, `section`, `layout`                                                                                                                                                     |
| `Story`        | `page`, `order`, `slot` (`lead` · `brief` · …), `headline`, `body`, `section`, `sourceUrl`, `sourceName`, `embedUrl?`, `isReserve`, `pulledAt?`, `pulledReason?`                            |
| `Image`        | `story`, `url`, `credit`, `licence`, `licenceUrl`, `kind` (`photo` · `illustration`)                                                                                                        |
| `Section`      | `slug`, `name`, `kind` (`core` · `guest`), `colour`, `voice`                                                                                                                                |
| `Puzzle`       | `edition`, `type`, `data` (JSON), `solution` (JSON)                                                                                                                                         |
| `Feature`      | `edition`, `type` (`number_of_day` · `weather` · `correction` · `classified`), `content`                                                                                                    |
| `Source`       | `name`, `url`, `type`, `sections`, `enabled`                                                                                                                                                |
| `Candidate`    | `source`, `url`, `fetchedAt`, `decision`, `decisionReason`, `run`                                                                                                                           |
| `PipelineRun`  | `edition`, `startedAt`, `finishedAt`, `status`, `log`                                                                                                                                       |
| `AdminAction`  | `action`, `issue?`, `slug?`, `detail?` (JSON), `at`: the admin's audit log, one row per action and per checked login, never the password                                                    |
| `Subscriber`   | `email` (unique), `confirmedAt?`, `unsubscribedAt?`, `timezone`                                                                                                                             |

A pulled story is marked (`pulledAt`, `pulledReason`), never deleted, and never served: reader
queries load only stories that are neither reserves nor pulled. A reserve takes its place; the
pulled story moves to a negative `order` on its page to free the position. Un-pulling puts a story
back in its place if it kept it, or among the reserves if a reserve took it.

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

**Status (2026-09-29): done, with one item moved to Phase 2.**

- Four designs kept, each with four pages: v1 Broadsheet (17 neon colourways) and v3 Tabloid, v4 Mini
  Zine, v5 Midi Magazine (house inks plus Gelato Counter, Paint Box and Carousel pastels). v2 was
  dropped. Mockups at `/mockups`, colour proofs at `/mockups/colours`.
- AA contrast passes on every page, colourway and paper at desktop and phone widths, with two known
  exceptions: the "12,408" banner number in v1 Sunburst UV, where the numerals mostly sit on yellow,
  and the unlit rating stars on v5 Screen & Sound, which are a graphic whose value is in their label.
- Clippings render at `/clip/{story|post|link}?story=…&look=v1|v3|v4|v5` in all three formats and
  every colourway (preview at `/mockups/clippings`). Fonts are fetched from Google Fonts at render
  time, so the renderer needs network access.
- Moved to Phase 2: page components in `packages/ui`, one set per design, now that the design
  depends on the day (decided 2026-09-29): weekday editions print in the Broadsheet, weekend editions
  in the Tabloid, Mini Zine or Midi Magazine. Each edition carries its `design` and `colourway`.

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

**Status (2026-09-30): built on sample editions.**

- Data model, seed (issues 38–45, including scheduled editions) and API, with the 07:00 local release;
  a scheduled edition releases itself, drafts and pulled editions are never served.
- Reader routes: today at `/`, `/issue/N`, `/issue/N/<section>`, `/issue/N/back`,
  `/issue/N/story/<slug>`, `/archive`, `/issue/N/print`. Every edition prints in its own design and
  colourway (Broadsheet on weekdays; Tabloid, Mini Zine or Midi Magazine at weekends), from templates
  in `apps/frontend/src/features/papers/`.
- Share bar with every composer in §7, Instagram through the share sheet (download and QR on
  desktop), link previews from the 1200×630 clipping, and a printable edition saved as PDF from the
  browser (server-rendered PDF is not built).
- Still to do: try the Instagram share sheet on real iOS and Android phones; move the shared print
  components into `packages/ui` once the mockups are retired.

### Phase 3 — Puzzles and habits

- Generated mini crossword, word game and riddle, with answers in the next edition
- On-device streaks, stamps and saved stories, stored mergeably

**Done when:** each sample edition has a playable back page, and a streak survives a reload.

**Status (2026-09-30): built on sample editions.**

- Puzzles generated per date by `packages/puzzles` (mini crossword, word ladder, riddle, word search
  from the day's headlines, fortune teller); the API serves today's without answers and yesterday's
  with them.
- Every design's back page plays them in pencil (`apps/frontend/src/features/play`), in that
  design's inks and layout, with yesterday's answers (the riddle's under today's folded corner).
  Solving one earns its sticker; they print as blank grids.
- On-device habits (`features/habits`, one mergeable event log): reading tracked on every page, a
  stamp and streak when a paper's finished (`/stamps`), stickers to stick on any page, the mood
  faces and the paper-plane sign-off, and kept stories (`/saved`). Paper sounds switch in the page
  bar.
- Still to do: merge the log into an account when sign-in lands. (The stamp book's streak now
  follows a preview `?now=`.)
- **The website around the paper** (2026-10-01, §7): the site bar, pager and fold; the front door's
  shutters, drop and receipt; Your Pile (replacing `/archive`) with search and birthday papers; Your
  Wall (replacing `/stamps` and `/saved`); story sheets, pass-it-on notes, How it's made (`/about`)
  and offline reading.

### Phase 4 — The automated newsroom

- `apps/newsroom` with the eight stages in §9
- Source allowlist, delight check, dedup, balance rules, grounded writing with the fact check
- Image licensing, reserves, Slow News Day fallback, emergency admin page
- Provider-neutral model interface; pick the provider here

**Done when:** a full week of editions publishes on schedule with no human action, every image has a
recorded licence, and a planted grim story is rejected by the delight check.

**Status (2026-09-30): the pipeline is built; the week-long unattended run is still to come.**

- `apps/newsroom` runs the eight stages of §9 (`pnpm --filter newsroom run edition -- --date D`),
  records every candidate's decision in `Candidate` and each stage's log in `PipelineRun`, and files
  the edition as `scheduled`. It is idempotent per date (`--replace` to rebuild).
- Allowlist of about 40 sources (RSS/Atom, Reddit JSON, NASA APOD, Spaceflight News, Wikipedia On
  This Day), synced into `Source`. The delight check runs a blocklist over the headline and the full
  text, then a batched classifier; uncertain means rejected. A planted grim story is rejected in tests.
- Dedup covers the last 14 days and the day's batch. Selection applies section quotas, a topic cap
  of 3, source caps and a strong lead, and keeps reserves. Stories are written from source text
  only, then fact-checked (numbers and proper nouns must appear in the source), with one rewrite
  before a reserve takes over. Source images are pressed into `apps/frontend/public/editions/<issue>/`
  with credit and licence. Design and colourway follow the weekday.
- AI provider: the Claude Code CLI is primary and Gemini's free tier is the fallback (§9). Falls back
  to the Slow News Day edition when the day cannot fill a paper.
- Scheduling: a launchd plist in `apps/newsroom/ops/` (not installed; see its README).
- First real run (issue 46, 2026-10-04): 287 items gathered, 18 stories served. Still to do: fill
  the Money and guest pages more reliably (more sources, looser text limits), make selection
  stricter about tone (see open issues in the report), and run a full week unattended.

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
- ~~AI provider~~ — decided in Phase 4: Claude Code CLI, with Gemini's free tier as fallback (§9)
- ~~The exact source allowlist~~ — drafted in Phase 4 (`apps/newsroom/src/sources.ts`)
- Whether any guest section ever gets its own fixed day
- ~~`Edition.guestSection` holds only the first guest~~ — replaced by `EditionGuest` (2026-10-01, owner approved)
