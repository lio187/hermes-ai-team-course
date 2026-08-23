#!/usr/bin/env bash
set -euo pipefail

HERMES_SKILLS_DIR="${HERMES_SKILLS_DIR:-$HOME/.hermes/skills}"
COURSE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$HERMES_SKILLS_DIR/course"

for skill in \
  intelligence-radar \
  operator-team-workflow \
  hermes-mission-control-builder \
  obsidian \
  youtube-content \
  brandkit \
  paper-mcp-design-workflows
do
  rm -rf "$HERMES_SKILLS_DIR/course/$skill"
  cp -R "$COURSE_ROOT/skills/$skill" "$HERMES_SKILLS_DIR/course/$skill"
  printf 'Installed %s\n' "$skill"
done

printf '\nKlaar. Herstart Hermes en controleer of de skills onder course/ zichtbaar zijn.\n'
