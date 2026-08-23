# Security Boundaries

## Read-only scope

Mission Control reads only the privacy-minimized profile roster, an allowlisted schedule projection, and native host state. V1 has no mutation controls and creates no secondary database, server, listener, task board, or content store.

## Data minimization

- Request profiles with `include_sessions: false` and render only name, model, provider, and skill count.
- The cron response may contain sensitive prompt and delivery fields. Inspect `prompt_preview` only transiently to detect whether `name` was derived from the prompt, then immediately return, cache, and render only the allowlisted view model: `display_name`, `schedule`, `enabled`, `state`, `next_run_at`, `last_run_at`, and `last_status`. Raw job objects and `prompt_preview` never persist, log, stringify, spread, cache, or render.
- Never request or render session data, profile paths/descriptions, credentials, `.env`, or `auth.json`.
- Missing data is `unknown` or `unavailable`, never implicitly healthy.

## Query isolation and opt-in

- Scope both profile and schedule query keys by the active connection ID (falling back to `local`) and active profile. Enable those queries only while the gateway is open, and never retain prior connection/profile rows as placeholder data after the scope changes.
- Register the plugin with `defaultEnabled: false`; reading profile and schedule metadata is explicitly opt-in.

## Authority and approval

Sandbox generation is constrained to the explicitly chosen sandbox. Installing into a live Hermes home is GREENLIGHT REQUIRED. Enabling/reloading the plugin, config changes, external sends, deployment, deletion, credentials, key changes, and network exposure are separate actions and are not performed by the builder.

## UI and dependencies

The plugin uses only the Desktop Plugin SDK, React, and React's JSX runtime. It uses native components and theme variables, with React Query at 15 seconds rather than a custom polling loop.
