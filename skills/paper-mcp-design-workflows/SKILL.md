---
name: paper-mcp-design-workflows
description: "Use when building or refining designs in Paper via MCP."
version: 1.0.0
metadata:
  hermes:
    tags: [paper, mcp, design, landing-pages, codex, visual-workflows]
---

# Paper MCP Design Workflows

Build and refine Paper documents through a coding-agent CLI while preserving source truth, proof integrity, mobile quality, and non-destructive review gates.

## Core workflow

1. **Lock the source.** Confirm the exact canonical URL, local product/brand sources, product hierarchy, and whether this is an optimization or a new concept. Exclude stale domain variants, cached captures, rejected builds, and mixed-version product context.
2. **Write a self-contained build brief.** Name the exact Paper file/pages, source paths, section order, visual tokens, protected directions, allowed placeholders, and completion report.
3. **Create non-destructively.** Use separate pages for current reference, optimized desktop, optimized mobile, and components/proof slots. Never overwrite, delete, or publish without explicit approval.
4. **Route assets by evidence role.** Distinguish structure, atmosphere, product proof, and outcome proof. Decorative artwork may frame a placeholder but must never impersonate evidence.
5. **Build desktop and mobile intentionally.** Mobile is not a shrunken desktop; preserve CTA priority, readable type, explicit carousel/disclosure cues, and unclipped proof.
6. **Fill media after structure.** Inspect actual image/video files before placement. Use verified product captures and clearly labelled missing-proof slots.
7. **Apply proof as a scoped update.** Resolve claims against canonical sources, remove superseded figures, keep evidence-capture slots, and update desktop/mobile/components consistently.
8. **Verify independently.** Require stable file ID/URL, screenshots, tree summaries, section counts, released locks, and a second read-only Paper MCP pass that reports mismatches only.
9. **Handoff.** Record embedded assets vs fallbacks, remaining placeholders, exact claims/sources, errors/limits, next media needed, and publication greenlight state.

## Codex invocation

For current Codex CLI:

```bash
codex exec --approve-for-me "<self-contained Paper MCP task>"
```

`--approve-for-me` already selects its sandbox; do not combine it with `--sandbox`.

Independent verification:

```bash
codex exec -s read-only "Use Paper MCP read-only to inspect file <ID>. Report mismatches only; mutate nothing."
```

Never treat the coding agent’s final prose as proof. Verify the remote artifact through Paper MCP and a resolvable file URL.

## Placeholder policy

A complete framework may be designed before all proof exists, but missing material must be named precisely:

- `REAL PRODUCT CAPTURE — REQUIRED`
- `STUDENT RESULT — FINAL PROOF REQUIRED`
- `NAME / ROLE / STARTING POINT / BUILD / RESULT / TIMEFRAME`
- `FOUNDER CLAIM EVIDENCE — SOURCE CAPTURE REQUIRED`
- `INVESTMENT — VERIFY WITH USER`

Do not insert sample names, quotes, stars, prices, guarantees, or outcome numbers as visual filler.

## Media rule

Inspect duration, codec, dimensions, sampled frames, spoken content, proof, and CTA before assigning a video. A captioned 60–90 second founder/course overview usually belongs as click-to-play hero media or founder proof—not an autoplay background. Keep the CTA visible before the video on mobile.

If native local-video insertion is unavailable, use a polished poster with play UI, duration/language/caption tags, and the exact source path in layer annotations. The poster is an implementation handoff, not a working player.

## Proof discipline

- Canonical evidence beats old copy.
- Resolve conflicting numbers and mark superseded pairs.
- Use identical figures across desktop, mobile, and components.
- Place source-capture slots beside material claims.
- Preserve confidentiality and tense distinctions.
- Use a scoped Paper update for proof changes rather than rerunning the whole design.

## Greenlight boundary

Paper design preparation is not publication. External publishing, live-site modification, deletion, and irreversible changes require explicit approval.

## Detailed playbook

See `references/codex-paper-mcp-design-workflow.md` for the full procedure, prompts, verification gates, media routing, and pitfalls.
