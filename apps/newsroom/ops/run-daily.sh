#!/bin/zsh
# Daily newsroom job (launchd runs this at 04:00 local; see news.yay.newsroom.plist).
# Builds tomorrow's edition and the day after's, so a failed night still leaves a day's slack.
# Each run is idempotent: an edition already filed for a date is left alone.
set -u
cd "${REPO_DIR:?set REPO_DIR to the repository root}" || exit 1
LOG="$HOME/Library/Logs/yay-newsroom.log"
# Optional secrets (GEMINI_API_KEY, NASA_API_KEY…) live in apps/newsroom/.env, which is gitignored.
for offset in 1 2; do
  day=$(date -v+${offset}d +%F)
  echo "=== $(date '+%F %T') building $day ===" >> "$LOG"
  pnpm --filter newsroom run edition -- --date "$day" >> "$LOG" 2>&1
done
