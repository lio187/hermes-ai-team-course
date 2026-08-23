# SPEC — Hermes Mission Control Builder

Source video: `https://www.youtube.com/watch?v=t6W_Zpohb7g`

## Product decision

**CURRENT HERMES — Build a reusable personal skill that scaffolds a native Hermes Desktop Mission Control plugin. Do not create another agent profile or reproduce the tutorial’s standalone VPS dashboard.**

The plugin discovers profiles dynamically, preserves a sole-Orchestrator approval gate, and uses the native Desktop Plugin SDK instead of adding a Python server, custom SQLite activity store, SSH tunnel, or Tailscale deployment.

## Requirements

- Use `$HERMES_HOME/desktop-plugins/hermes-mission-control/plugin.js`.
- Use `profiles.list` with `include_sessions: false`; render only name, model, provider, and skill count.
- Use read-only `cron.manage` list data. Detect prompt-derived names transiently and cache/render only `display_name`, `schedule`, `enabled`, `state`, `next_run_at`, `last_run_at`, and `last_status`.
- Use native gateway/profile/model/busy state. Unknown data stays unknown.
- Implement Overview, Profiles, and Schedule; leave Tasks and Library explicitly `not connected`.
- Use native theme tokens, React Query at 15 seconds, route `/mission-control`, sidebar nav, and palette navigation.
- Scope query keys by connection and active profile; query only while gateway is open and never show stale prior-profile rows.
- Ship opt-in with `defaultEnabled: false`.
- Builder precedence: explicit `--hermes-home` → `$HERMES_HOME` → `~/.hermes`.
- Support `--dry-run` and `--force`; never overwrite without `--force`.
- Reject symlinked destination components and use atomic no-clobber installation for non-force writes.
- Live installation requires the operator’s explicit greenlight.

## Rejected tutorial details

- Fixed five-agent topology.
- “Always approve” gateway behavior.
- Custom agent logging database.
- VPS, Discord, SSH-key, root-login, public port, and Tailscale setup.
- Mutation controls for Tasks or Library.

## Acceptance

- Generated JavaScript passes `node --check`.
- Missing state renders unavailable/unknown.
- Profile/session/cron prompt secrets are not rendered.
- Dry run writes nothing.
- Existing plugin refuses without force, including race and symlink cases.
- Force is deterministic and reproduces template bytes.
- Independent review and sandbox smoke tests pass before live use.
