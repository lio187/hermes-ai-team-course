# Website — The Conversion Machine SOP

> **This is Step 5.** Run the *Deep Research SOP* (Step 1), the *Brand Guide SOP* (Step 2), the *design.md* lesson (Step 3), and the *Hero Video* lesson (Step 4) first — they produce every input this build needs.
>
> Drop this file into the **same folder** that already contains those inputs. Claude Code will turn them into a **single-page, on-brand, conversion-first website** — copy written first, then dressed in the brand — output as one self-contained `index.html` plus the `assets/` folder, **running locally**. It ships to a real URL later (Step 9), not here.

---

## Prerequisite — these files must already be in this folder

From Steps 1–4:

1. `deepresearch.md` — the research dossier (market, competitors, customer language, proof points).
2. `avatar-sheet.md` — the completed customer avatar.
3. `offerbrief.md` — product, promise, mechanism, proof, pricing, value anchor.
4. `necessary-beliefs.md` — the 4–6 "I believe that…" statements. **These decide the sections.**
5. `project-knowledge.md` — the synthesized reference (incl. what's **verified vs. unverified**).
6. `claude-project-instructions.md` — the copywriter system prompt (incl. the proof rules + voice).
7. `brand-guide.html` — the Brand Book (Voice of the Customer quotes + the Messaging Library).
8. `design.md` — the distilled design tokens (palette + hex, fonts, accent-is-status rule, components, motion, voice). **This is the magic phrase: "use my design.md."**
9. `assets/` — must contain `hero.mp4`, `hero-poster.jpg`, `logo.png`, plus any section images.

If `design.md` is missing, stop and run Step 3. If `assets/hero.mp4` is missing, you may proceed with a static gradient hero from the design tokens and **flag it** — but do not invent one. **These files are ground truth. Never contradict or invent beyond them.**

---

## What Claude Code Will Produce

By the end of this workflow, this folder will contain:

1. **`index.html`** — a single self-contained one-scroll marketing page. Inline CSS in a `<style>` block, driven by CSS custom properties for every token from `design.md`. One section per necessary belief: hero → problem → mechanism → proof → offer → close (the **beliefs** decide which sections exist and in what order).
2. **The hero wired in** — `<video poster="assets/hero-poster.jpg">` autoplay/muted/looping/`playsinline` with `assets/hero.mp4`, logo top-left, headline + sub-hook overlaid and readable.
3. **Any section images** referenced by relative `assets/…` paths so the page stays portable.
4. **A one-line "run it locally" instruction** so the student can open the page immediately (e.g. `python3 -m http.server 8000` then open `http://localhost:8000`, or just open `index.html` in a browser).

The page is **not deployed** here. It runs locally; Step 9 ships it.

---

## Instructions To Claude Code (Execute These In Order)

You are a **senior conversion copywriter + brand designer + front-end engineer** in one. Your job is to build a one-page site that reads like it came from a top studio and converts like a sales page — because the words come first and the design only dresses them. Ground **every** line in the foundation files: if a claim, stat, or quote isn't in them, you don't have it (see Proof Discipline). Default to depth and craft over speed. When you need a decision from the user, ask one clear question at a time.

> **If you are running inside the course lesson:** the lesson owns the counter — **never write a `current_step` higher than the lesson's own `total_steps`.** Steps 0–5 below all run inside a single lesson STEP, so they are progress *within* that step, not steps of their own: work through **map** (0–2), **copy** (3), **build** (4) and **verify** (5) without advancing `current_step` past the step you were invoked from, and let the lesson set `current_step` to `total_steps` and append its own id to `completed_lessons` at its own final STEP. If `~/.the-ai-operator/progress.json` doesn't exist, you're running standalone — skip this and carry on.

### Step 0 — Read everything & map the sections

First, **read all the prerequisite files in full** — especially `necessary-beliefs.md`, `brand-guide.html` (Voice of the Customer + Messaging Library), `claude-project-instructions.md` (voice + proof rules), `offerbrief.md` (offer + price anchor), and `design.md` (the tokens). List the contents of `assets/` and note exactly what's there.

In your own working notes, pull out: the positioning, the unique mechanism (its ownable name), the 4–6 necessary beliefs **in order**, the strongest **verbatim** customer quotes, the proof inventory, the offer + price anchor, the CTA destination — and, critically, **which claims are flagged UNVERIFIED**. Those stay out of the page.

Then **map the sections from the beliefs**. One section per belief the visitor must cross to act. The default arc:

```
HERO  →  PROBLEM  →  MECHANISM  →  PROOF  →  OFFER / PRICING  →  CLOSE (CTA)
```

But the beliefs decide it. If there are five beliefs, there are roughly five argument sections (plus hero + close). If a belief is "I believe a tool like this can actually fit my workflow," that earns its own section. Write the section map down as a numbered list — section name + the one belief it advances + the headline angle — and confirm it with the user before building.

### Step 1 — Confirm the few decisions you can't infer

Read the answers out of the files first; only ask what's genuinely missing. Group these into one message:

1. **CTA destination** — where does the primary button go? (Book a call / buy link / waitlist / Calendly URL.) Use the messaging-library CTA label if one exists.
2. **Section order / emphasis** — confirm the map from Step 0, or move a section. Which belief is the heaviest objection (it gets the most real estate)?
3. **Layout vibe / reference** — any reference screenshot in the folder to follow for *structure* (not styling)? If not, you'll pull refs in Step 2.

Don't ask about colors, fonts, voice, mood, or proof — those are already locked in `design.md` and the brand guide. Lock to them.

### Step 2 — Reference the right layout patterns (structure only)

For each mapped section, pull a real layout pattern so the structure is proven, not guessed. Use **Mobbin** (via the Mobbin MCP — `search_screens` / `search_flows`) and **21st.dev** for the section types you mapped: a video-hero, a problem/pain stack, a "how it works" mechanism, a proof/logos/stats strip, a pricing/offer block, a closing CTA. Note for each section: which reference, and the one structural idea you're taking (e.g. "Mobbin: split hero, copy left / video right" or "21st.dev: 3-up mechanism cards with numbered steps").

**Reference layout only — never styling.** The look comes 100% from `design.md`. You are borrowing structure, hierarchy, and spacing logic, not colors or fonts. If the MCPs aren't available, fall back to the structure described in the one-pager template and proceed.

### Step 3 — Write the copy FIRST (before any HTML)

This is the discipline the whole lesson rests on: **copy before styling.** Open the Messaging Library in `brand-guide.html` and the voice rules in `claude-project-instructions.md`, and write the full conversion copy for every mapped section into a working draft — headline, sub-head, body, CTA label per section — in the brand voice:

- **Hero** — the hook + sub-hook from the Messaging Library. Italicize the one emphasis word (accent font). The CTA label is the real one.
- **Problem** — the customer's own words. Lift **verbatim** pains from the Voice of the Customer section. Never paraphrase the pain; quote it.
- **Mechanism** — name the unique mechanism by its ownable name; explain *why* it works in 2–4 steps, not just that it does.
- **Proof** — **only sourced claims.** Real numbers, specs, named credibility, or first-party quotes from the brand guide / `project-knowledge.md`. If there's no hard proof, write an honest credibility strip — never a fabricated stat or testimonial.
- **Offer / Pricing** — the offer detail + the value anchor from `offerbrief.md`.
- **Close** — earned urgency + the CTA. No false scarcity.

**Never invent a claim, stat, testimonial, or number.** If a section needs a line you don't have, use the closest real Messaging-Library line, or leave a clearly-marked `[FILL: …]` for the student and tell them. Anything flagged **UNVERIFIED** in `project-knowledge.md` stays out of the page entirely.

### Step 4 — Build the page (drive it through the template)

Don't reinvent the build. Use the existing machinery: the **one-pager master template** at `~/.claude/commands/operator/gifts/website-onepager-template.md` (fallback: `gifts/website-onepager-template.md` in the course folder), filled with the brand's REAL values — the exact palette/hex and fonts from `design.md`, and the actual copy you wrote in Step 3. If `/operator:M2.5-website` STEP 2 has already produced a `BRAND-CONTENT-SPEC.md`, build from that spec directly — it is the contract. Start the build prompt to yourself with the magic phrase — **`Use my design.md.`** — so it's on-brand from line one.

Then assemble **one self-contained** `index.html`:

- **CSS inline** in a `<style>` block, every token defined once as a CSS custom property (`--canvas`, `--accent`, `--display-font`, etc.) pulled straight from `design.md`, so the whole look is editable in one place.
- **Fonts** loaded via `<link>` (Google Fonts / Fontshare) or `@font-face`, always with system fallbacks. The display/headline family for headings + UI, the accent face (usually an editorial serif italic) for **one emphasis word per heading + big numerals**, the mono/label family for eyebrows.
- **Hero, wired exactly:**
  ```html
  <video autoplay muted loop playsinline poster="assets/hero-poster.jpg"
         class="hero-video">
    <source src="assets/hero.mp4" type="video/mp4">
  </video>
  ```
  Logo top-left via `<img src="assets/logo.png">`. Headline + sub-hook overlaid on a subtle scrim/gradient so the text stays readable over the moving video. The loop must be **subtle** — it's a background, not the show.
- **Sections** in the mapped order, eyebrows (mono caps) above each section heading, depth on every section (an ambient gradient/glow/texture per the mood — never a flat dead band), and the **accent used only for status, one emphasis, and the primary button** — never as a body color.
- **Components** from `design.md`: primary/secondary buttons (44px min tap target), standard + featured cards, status dots.
- **Motion:** subtle scroll fade-up on headlines and cards via an `IntersectionObserver` (15–25px lift, ~400–600ms). Never aggressive. Motion beyond this — the ladder, the WebGL hero, the cinematic — is STEPs 6–12 of `/operator:M2.5-website`, and the runnable recipe is `gifts/webgl-hero-kit.md`. Don't build it here.
- **Responsive:** every multi-column grid and the hero collapse cleanly to one column on mobile; nav links hide; the video still behaves.
- **Build target:** a single self-contained `index.html` + the `assets/` folder. Switch to Vite/React **only if the student asks.**

When the page is assembled and styled, move on to the verification pass — nothing is done until it renders.

### Step 5 — Run it locally & verify before you call it done

**Run it.** Print the one-line instruction and start it:

```
python3 -m http.server 8000   # then open http://localhost:8000
# or simply: open index.html   (a page carrying an import map must be served, not opened from disk)
```

**Then verify — open it and read it as the customer would, top to bottom:**

- **Each section moves one belief.** The argument flows hero → problem → mechanism → proof → offer → close. No section is decoration.
- **The hero loop is subtle and the text is readable** over the video on first paint and mid-loop. The poster shows before the video loads.
- **The accent is rare** — status, one emphasis, the button. If it's everywhere, pull it back.
- **Grids collapse on mobile** (resize to ~390px wide): hero stacks, cards go one-column, nothing overflows, tap targets ≥ 44px.
- **No fake data.** Every number, quote, and logo on the page is sourced from the foundation files. Nothing flagged UNVERIFIED slipped in. No lorem ipsum, no placeholder copy.
- **Fonts actually load** and the logo is visible against its background.

Fix anything that fails, re-open, re-check. **Don't call the page done until it runs locally and passes every line above** — then hand it back to the lesson.

---

## Final Step — Handoff

List the produced files with one-line summaries, then tell the user:

1. The site is **running locally** — open `http://localhost:8000` (or `index.html`). Read it as your customer would.
2. To edit the look: change the CSS custom properties at the top of the `<style>` block (colors/fonts/spacing). To edit the words: change the section copy. Both are in the one file.
3. If anything's off, tell Claude exactly what to change — then polish the finish in **Claude Design** if you want one more pass.
4. **This is not live yet.** It ships to a real URL in Step 9, once the rest of the operation is built. For now, it's a running, on-brand conversion machine on your machine.

---

## Operating Principles (apply throughout)

- **Copy first, design second.** Write the words from the Messaging Library before you write a line of HTML. The design dresses the argument; it never leads it.
- **One section per belief.** The `necessary-beliefs.md` list is the spine of the page. The visitor crosses one belief per section on the way to the CTA.
- **Use my design.md.** The look comes 100% from `design.md` and the brand guide — not a template default, not a fresh palette. On-brand from the first line of code.
- **Proof Discipline (non-negotiable, carried from `claude-project-instructions.md`):**
  - No claim, stat, testimonial, or proof point appears unless it exists in `project-knowledge.md` or `deepresearch.md`. If you want one and can't source it, **flag the gap** — never fabricate.
  - Anything flagged **UNVERIFIED** stays out of the page entirely.
  - If a claim was flagged refuted/false in the research, it **never** appears, under any framing.
- **Customer language, verbatim.** Quote the exact phrasing from the research for the problem; use the brand's language for the solution.
- **One accent, used sparingly.** Restraint reads as premium; decoration reads as cheap. Status, one emphasis, the button — that's it.
- **Reference structure, not style.** Mobbin and 21st.dev give proven layouts; `design.md` gives the look. Never let a reference's colors or fonts leak in.
- **Self-contained & portable.** Inline CSS, relative `assets/…` paths, CDN/embedded fonts — the folder should work when zipped and moved. The build target is one `index.html` + `assets/`, React only on request.
- **Verify as the customer, not the coder.** "It renders" is not done. Done is: it reads, it converts, the hero is readable, mobile holds, and there's no fake data.
