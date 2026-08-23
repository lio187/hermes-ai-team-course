# Hermes — The Operations Layer SOP

> **This is Step 8.** Run the *AI Agents SOP* (Step 6) and the *Custom Dashboard SOP* (Step 7) first — they produce the `agents/` folder and the Mission Control dashboard that this layer orchestrates. Without them there is nothing to run.
>
> Drop this file into the **same project folder** that already contains `agents/` and the dashboard. Claude Code will tie those two into **one owned, hardened operations layer** — Hermes — that runs the agents on a schedule, shows the work on the dashboard, routes every exception to a human, and survives a reboot. Containerized, allowlisted, audited, least-privilege. Real infrastructure you own, not a demo.

---

## Prerequisite — these inputs must already be in place

1. **`agents/`** — the voice-trained agents from Lesson 6: each `agents/<workflow>/spec.md` (role, voice prompt, tools/MCP, **allowlist**, **escalation rules**, success criteria), the runnable agent definitions, `agents/test-log.md`, and `agents/README.md`. These are what Hermes runs.
2. **The Mission Control dashboard** — the owned, on-brand dashboard from Lesson 7. Hermes feeds it the agent-activity log so the work shows up live.
3. **`brand-guide.html` + the six foundation files** — still ground truth. Anything an agent says under Hermes obeys the same proof discipline (verified vs. unverified).
4. **The environment + access + security posture** — decided in **Lesson 8 STEP 2**: *where* it runs (a machine/VPS/container host you control), *what* it's allowed to touch, and the keys it needs. If these aren't decided, stop and decide them — the hardening depends on them.

If `agents/` is missing, run Step 6. If the dashboard is missing, run Step 7. **You are wiring existing, tested parts into infrastructure — not building new agents here.**

---

## What Claude Code Will Produce

By the end of this workflow, the project will contain an **`ops/`** directory — the orchestration layer the student **owns and runs**:

1. **`ops/orchestrator/`** — the runner. A small Node or Python service that **schedules and triggers** the agents (cron-style timers, an event/queue trigger, or both), invokes each via its Lesson-6 definition, enforces the allowlist, writes every action to the audit log, and pushes activity to the dashboard. Framework-light: the existing Claude Code agents/MCP + a thin loop, not a heavy agent framework.
2. **`ops/Dockerfile` + `ops/docker-compose.yml`** — the **containerized** setup so the whole layer is isolated and reproducible. One command brings it up; it runs the same on any host.
3. **`ops/allowlist.yml`** (or `.json`) — the **central permissions config**: per agent, the exact actions/tools it may run autonomously, and what must go human-in-the-loop. One file to read, audit, and tighten.
4. **`ops/audit.log`** (append-only) — every agent action, taken *or* escalated, with timestamp, agent, input, output, and decision. The record of what the system actually did.
5. **`ops/.env.example` + a secrets approach** — least-privilege, per-agent, scoped keys, loaded from env or a secret store. **Never hardcoded, never committed.** The real `.env` (or store) stays out of git.
6. **`ops/RUNBOOK.md`** — the short operator's manual: how to **start / stop / inspect / restart / rotate keys / kill** the layer, and where exceptions land.

---

## Instructions To Claude Code (Execute These In Order)

You are a **senior platform/SRE engineer + security-minded operations architect** in one — the person a 7-to-8-figure brand trusts to put AI agents into production *without* a 3 a.m. incident. You are building the layer that lets the operator sleep while it runs. You are paranoid about exactly one thing made concrete: an agent with access to the store, the email list, and the finance accounts is only safe **if it is built to be**. That is the access paradox, and it is the heart of this build. Default to depth and hardening over speed. Verify, never assert — you do not call this thing "running 24/7, hardened" until you have watched it do so. When you need a decision, ask one clear question at a time.

### Step 0 — Read the parts you're wiring together

First, **read the existing artifacts in full** before you build anything:
- Every `agents/<workflow>/spec.md` — the role, the **allowlist**, the **escalation rules**, the tools/MCP, and how each agent is invoked (subagent / skill / script). This is your inventory of what Hermes will run and what each agent is and isn't allowed to do.
- `agents/README.md` and `agents/test-log.md` — how each agent runs today and which cases it escalates.
- The dashboard's agent-activity view — find *where* it reads activity from (a file, an endpoint, a table). That is the contract Hermes must write to.

Then confirm with the user, one question at a time:
1. **The host** — where does this run? (A always-on machine, a VPS, a home server, a container host.) Confirm it has Docker, or decide the equivalent.
2. **The trigger model per agent** — is each workflow **scheduled** (every N minutes/hours), **event-driven** (a webhook / new ticket / new order), or **on-demand**? Most are a schedule; some need an event hook.
3. **The keys** — which scoped credential does each agent use, and is it already a *least-privilege* key (read-only where the workflow allows, write only where it must)? If any key is broad, flag it to scope down before launch.
4. **The exception channel** — where do escalations go so a human actually sees them? (Email, Slack, a dashboard queue.) Hermes is useless if exceptions fall into a void.

### Step 1 — Design the orchestration (write it down before you build it)

Decide the shape of the layer and write it as the spec the build follows:

```
# Hermes Orchestration
## Runner
- Language/runtime:        [Node or Python — match what the agents use]
- Trigger engine:          [internal cron timers | system cron | a small queue | event webhooks — or a mix]
- How an agent is invoked: [the exact call per agent — subagent run / skill invoke / script exec]
## Per-agent schedule/trigger
- <agent-a>:  every [N min] · reads [source] · acts via [tool/MCP]
- <agent-b>:  on event [webhook/new-ticket] · ...
## Flow of one run
  trigger → load scoped key → check allowlist → run agent → 
    if action ∈ allowlist → execute + append audit + push to dashboard
    if action ∉ allowlist (irreversible / money / risk / edge case) → DON'T execute → escalate to [channel] + append audit
## Health
- Heartbeat:    [each agent writes last-run-OK timestamp]
- Restart:      [container restart policy; what brings it back after a reboot]
- Kill switch:  [the single command/flag that halts ALL agents immediately]
```

Keep it **vendor-neutral**: Docker/compose for containment, cron or a light queue for scheduling, a small Node/Python orchestrator, and the existing Claude Code agents + MCP servers. A solo operator must be able to stand this up — no enterprise platform, no proprietary control plane. If it can't run on one box with `docker compose up`, it's too heavy.

### Step 2 — Build the central allowlist (the fence, in one file)

Before the runner can execute anything, write `ops/allowlist.yml` — the single, auditable source of what each agent may do. Pull the per-agent allowlists straight from the Lesson-6 `spec.md` files; **the orchestrator reads this file and refuses any action not on it.**

```
# ops/allowlist.yml
agents:
  <support-agent>:
    autonomous:                 # the safe ~90% it runs alone
      - draft_and_send_reply: { templates: [wismo, returns], data: read_only }
      - tag_ticket
    human_in_the_loop:          # drafted, never executed alone
      - issue_refund            # moves money
      - cancel_order            # irreversible
      - any: complaint|legal|health-claim|press   # reputation-at-risk
    escalate_when:
      - required_fact_not_in_data
      - sentiment: angry|legal|safety
      - request: edge_case_not_listed
    key: SUPPORT_KEY            # scoped, read-mostly, this agent only
```

The rule the runner enforces everywhere: **autonomous on the safe, well-trodden 90%; human-in-the-loop on the irreversible, money-moving, or reputation-risking 10%; escalate on anything off the list.** A missed escalation is a worse failure than an over-cautious one. **The access paradox is mechanical here:** the broader an agent's key and capabilities, the *shorter* its `autonomous` list and the *longer* its `human_in_the_loop` list must be. Power and guardrails scale together — never grant a capability "just in case."

### Step 3 — Build the orchestrator/runner

Build `ops/orchestrator/` as the small service from Step 1. It must do exactly these, and nothing it isn't asked to:

- **Schedule + trigger** each agent per the Step-1 plan (timers/cron for scheduled work, a webhook/queue listener for event-driven work).
- **Load the scoped key** for that agent from the environment/secret store at run time — never read a key it isn't assigned, never log a key.
- **Enforce the allowlist** by reading `ops/allowlist.yml`: an action on the `autonomous` list runs; anything else is **not executed** — it's packaged as an escalation and routed to the human channel from Step 0.
- **Append to the audit log** on *every* run — action taken or escalated — with `timestamp · agent · trigger · input · output/decision · allowlist-result`. Append-only; the runner never rewrites history.
- **Push to the dashboard** by writing each event to the activity contract you found in Step 0, so Mission Control shows the work live.
- **Heartbeat + kill switch** — each agent writes a last-run-OK timestamp the dashboard can show; a single env flag or command (`ops/kill` / `HERMES_HALT=1`) stops all agents at once.

Keep customer data **blurred-and-labelled** anywhere it could surface in a log or on screen — `[CUSTOMER]`, `[ORDER#]`, `[EMAIL]` — so the audit log and dashboard are safe to screen-record.

### Step 4 — Containerize it (containment is the wall)

Write `ops/Dockerfile` and `ops/docker-compose.yml` so the whole layer runs **isolated and reproducible**:

- The orchestrator runs **inside a container** — its own filesystem, its own process space, only the network and volumes it actually needs. This is the containment boundary: if an agent misbehaves, it's fenced to the container, not loose on the host.
- **Secrets come in via env / an `env_file` / a mounted secret**, referenced in compose — **never baked into the image, never in the repo.** Ship `ops/.env.example` with the variable names and empty values; the real `.env` is git-ignored.
- **Mount only vetted skills/MCP servers** the agents are tested against — nothing unvetted gets a path into the container. A skill or MCP server the agents haven't been hardened against is an unlocked door.
- Set a **restart policy** (`restart: unless-stopped`) so the layer comes back after a crash or reboot — the first half of the 24/7 story.
- Confirm `.gitignore` excludes `ops/.env`, `ops/audit.log`, and any local secret — verify it, don't assume it.

### Step 5 — Lock down secrets (least privilege, scoped, rotatable)

Make every credential the smallest key that does the job:

- **One key per agent, scoped to one workflow.** Revoking or rotating one must not touch the others. Read-only wherever the workflow allows; write scope only where it's required.
- **Loaded from env or a secret store** at runtime — never hardcoded, never logged, never committed. The runner reads only the keys assigned to the agent it's running.
- **Rotatable in one place.** Document in the runbook exactly how to rotate a key (swap the env value, `docker compose up -d` to reload) so a leaked key is a five-minute fix, not a rebuild.
- **State it plainly:** the agent with the broadest reach (store + email + finance) is the one whose key must be the tightest and whose human-in-the-loop list must be the longest. If you can't scope a key down far enough for the capability, the agent stays in **draft/dry-run** until you can.

### Step 6 — Deploy it to run around the clock

Bring the layer up on the host and make it survive a reboot:

```
# from ops/
docker compose up -d            # build + start, detached
docker compose ps               # confirm the orchestrator is Up
docker compose logs -f          # watch it tick through its first scheduled runs
```

- Confirm the **restart policy** holds: stop the container, confirm it comes back; if the host supports it, confirm the layer comes up on boot. **Don't claim it survives a reboot until you've restarted something and watched it return.**
- Confirm the **schedule actually fires** — watch the logs show an agent triggering on its timer/event, not just the service sitting idle.

### Step 7 — Verify end-to-end (the part that proves it)

Run **one real task through the whole loop** and confirm every link holds. This is the test that turns "deployed" into "working":

1. **Trigger a real task** an agent should handle autonomously (e.g. a genuine "where is my order" the support agent owns).
2. **Confirm the agent did the work** — correct action, on-brand voice, within its allowlist.
3. **Confirm the dashboard shows it** — the activity appears in Mission Control's feed, live, with the heartbeat updating.
4. **Confirm the audit log recorded it** — the action is appended with timestamp, input, output, decision.
5. **Now trigger an exception** — a task that should escalate (an edge case, a refund, an angry/legal message). Confirm the agent **did not** execute it, that it routed to the human channel from Step 0, and that the escalation is in the audit log too.
6. **Confirm the guardrails hold** — try (in a dry-run) to make an agent take an action *not* on its allowlist and confirm the runner refuses and escalates instead. **Test the kill switch:** fire it, confirm all agents halt.

Report the result honestly — what passed, what didn't, what you fixed. If any link fails, fix it and re-run the full loop. **Don't call Hermes live until the whole chain — agent acts → dashboard shows → exception routes → guardrails refuse → kill switch halts — has actually run in front of you.**

> **If you are running inside the course lesson:** the lesson owns the counter — **never write a `current_step` higher than the lesson's own `total_steps`.** The seven stages below all run inside a single lesson STEP, so they are progress *within* that step, not steps of their own: work through **orchestrate** (1–3), **harden** (4–5), **deploy** (6) and **verify** (7) without advancing `current_step` past the step you were invoked from, and let the lesson set `current_step` to `total_steps` at its own final STEP. If `~/.the-ai-operator/progress.json` doesn't exist, you're running standalone — skip this and carry on.

---

## Final Step — Handoff

List the produced artifacts with one-line summaries (`ops/orchestrator/`, `ops/Dockerfile` + `docker-compose.yml`, `ops/allowlist.yml`, `ops/audit.log`, `ops/.env.example`, `ops/RUNBOOK.md`), then tell the user:

1. **What's running and where** — the host, the container, which agents run on which schedule/trigger, and the **honest** status (running 24/7 only if you verified it survives a restart and fires on schedule).
2. **What it will and won't do alone** — the allowlist boundary in plain language: the safe work it runs autonomously, and what it always hands to a human. Name where exceptions land.
3. **The verification result, honestly** — the end-to-end loop you ran, what the dashboard showed, that the exception routed, and that the guardrails and kill switch held. Real results only.
4. **How to operate it** — point to `ops/RUNBOOK.md`: start / stop / inspect / restart / **rotate a key** / **kill all agents**.
5. **This is infrastructure you own** — agents + dashboard + orchestration, hardened, in your environment. To widen what an agent may do, edit `ops/allowlist.yml` — and only after a fresh round of agent tests passes. **More power = more hardening.**

---

## Operating Principles (apply throughout)

- **The access paradox is the whole job.** More capability demands more containment, tighter allowlists, more human-in-the-loop, more logging. The agent that can touch store + email + finance gets the tightest key and the longest escalation list. Never grant a power "just in case."
- **Contain it.** Everything runs inside the container with only the network, volumes, and skills/MCP it actually needs. The container is the wall between a misbehaving agent and your host.
- **Allowlist over trust.** The runner executes only what's on `ops/allowlist.yml`. Anything off the list is not run — it's escalated. Autonomous on the safe 90%, human-in-the-loop on the irreversible/money/reputation 10%.
- **Human-in-the-loop on the exceptions.** Irreversible, money-moving, or reputation-risking actions are drafted and handed to a person — never executed alone. Exceptions must reach a human, not a void.
- **Audit everything, append-only.** Every action taken or escalated leaves a timestamped record the system never rewrites. If it isn't logged, it didn't happen.
- **Least-privilege secrets.** One scoped, rotatable key per agent; read-only where you can. Never hardcoded, never committed, never logged.
- **Only vetted skills and MCP servers.** Nothing the agents haven't been hardened against gets a path into the container. An unvetted tool is an unlocked door.
- **A kill switch you've tested.** One command halts all agents. Confirm it works *before* you need it.
- **Verify, never assert.** Don't claim "running 24/7" until it survives a restart in front of you; don't claim "hardened" until the guardrails refuse a real off-allowlist action; don't claim "live" until the end-to-end loop ran. Honesty over a clean-looking demo.
- **Framework-light, vendor-neutral, owned.** Docker/compose + cron/queue + a small Node/Python runner + the existing Claude Code agents/MCP. A solo operator can stand it up on one box — and it survives a tool swap.
- **Blur-and-label sample data.** Anything real in the audit log, the dashboard, or a screen-recording gets masked — `[CUSTOMER]`, `[ORDER#]`, `[EMAIL]`.
