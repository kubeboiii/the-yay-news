# newsroom

The automated newsroom (PLAN §9): a daily job that builds each edition of The Yay News from an
allowlist of sources and files it as `scheduled`, so it releases at 07:00 local time on its date.

```
gather → delight check → dedup → select → write + fact check → illustrate → features → lay out + publish
```

Every candidate's fate (and why) is recorded in `Candidate`, and each run's stage log in
`PipelineRun`. If the day cannot make a regular edition, the Slow News Day edition from the
evergreen bank (`src/evergreen/`) is filed instead.

## Running it

```sh
pnpm --filter newsroom run edition -- --date 2026-10-04             # build and file
pnpm --filter newsroom run edition -- --date 2026-10-04 --dry-run   # build only; writes out/<date>.json
pnpm --filter newsroom run edition -- --date 2026-10-04 --model fake --dry-run   # offline
pnpm --filter newsroom run edition -- --date 2026-10-04 --replace   # rebuild an existing edition
pnpm --filter newsroom run edition -- --date 2026-10-04 --replace --slow-news-day
```

Without `--date` it builds tomorrow (UTC). A date that already has an edition is left alone unless
`--replace` is given, so the job can be rerun safely. Dry runs still record a `PipelineRun` (marked
`dryRun`) but file nothing and download no pictures.

Needs `DATABASE_URL` (read from `packages/db/.env`), Python 3 with Pillow for pressing pictures
(`apps/frontend/scripts/fetch_image.py`), and a model provider.

## Model providers

The model sits behind one interface (`src/model/types.ts`): `complete(prompt, { tier, schema })`.
Cheap-tier calls classify, writer-tier calls write. Work is batched: the delight check classifies up
to 60 candidates per call, stories are written about five per call, and the features take one call.

| `NEWSROOM_MODEL` | What                                                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude-code`    | **Default.** The local Claude Code CLI (`claude -p --output-format json`): Haiku for the cheap tier, Sonnet for the writer. Uses your Claude subscription, no API key. |
| `gemini`         | Google Gemini Flash on the free tier over REST, JSON mode. Needs `GEMINI_API_KEY`.                                                                                     |
| `fake`           | Deterministic and offline, for tests. Only ever used when named.                                                                                                       |

`NEWSROOM_MODEL_FALLBACK` lists the fallbacks in order (default `gemini`). If a provider fails a
call (not installed, an error, a timeout or an off-schema reply), the next one serves it and the
switch is logged; a provider that fails twice is skipped for the rest of the run.

Other settings: `NEWSROOM_CLAUDE_BIN` (path to `claude`), `NEWSROOM_TIMEOUT_MS` (per CLI call,
default 300000), `GEMINI_MODEL` / `GEMINI_CHEAP_MODEL` (default `gemini-2.5-flash` /
`gemini-2.5-flash-lite`), `NASA_API_KEY` (default `DEMO_KEY`) and `NEWSROOM_SITE_URL` (the
reader's public origin, used as the source link for evergreen items).

### Setting up the Gemini fallback

1. Create a free API key at <https://aistudio.google.com/apikey>.
2. Put it in `apps/newsroom/.env` (gitignored):

   ```sh
   GEMINI_API_KEY=your-key
   ```

3. Check it: `NEWSROOM_MODEL=gemini pnpm --filter newsroom run edition -- --date <a free date> --dry-run`.

The free tier is rate-limited (requests per minute and per day); one edition needs roughly 10–15
calls, which fits comfortably.

## Scheduling (macOS launchd)

`ops/news.yay.newsroom.plist` runs `ops/run-daily.sh` every day at 04:00 local time. The script
builds tomorrow's edition and the day after's (idempotent, so the second is a head start, and a
failed night still leaves a day's slack), logging to `~/Library/Logs/yay-newsroom.log`. It is not
installed by default. To install it:

```sh
# 1. Point it at the repo: edit REPO_DIR in the plist.
# 2. Install and load it for your user:
cp apps/newsroom/ops/news.yay.newsroom.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/news.yay.newsroom.plist
# Run it once now to check:
launchctl kickstart -k gui/$(id -u)/news.yay.newsroom
tail -f ~/Library/Logs/yay-newsroom.log
# To remove it:
launchctl bootout gui/$(id -u)/news.yay.newsroom && rm ~/Library/LaunchAgents/news.yay.newsroom.plist
```

The job runs as you, so `claude` must be logged in for your user (run `claude` once
interactively), and `pnpm` and `python3` must be on the login shell's `PATH` (the plist uses
`zsh -l`). launchd runs a missed 04:00 job when the Mac next wakes.

## Sources

The allowlist is `src/sources.ts`: about 40 feeds and APIs, each tagged with the sections it can
feed. It is synced into the `Source` table at the start of every run; set `enabled = false` on a
row to switch a source off (the sync never turns it back on). Reddit's JSON endpoints refuse
unauthenticated requests from many networks (HTTP 403); they fail quietly and the run carries on.
