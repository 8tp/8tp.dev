# Build notes — writing plan

**Status:** planned, nothing built yet
**Decided:** Aug 2026
**Shape:** standalone pages hung off projects. **Not a blog.**

---

## 1. The shape

No `/blog`, no index, no dates, no RSS, no nav item. Each piece is a page attached to
the project it is about, linked from that project's entry in Selected work:

```
8tp.dev/imprimatur/xfa      ← linked from the Imprimatur entry
8tp.dev/instagib/netcode    ← linked from the Instagib Arena entry
```

**Why not a blog:** a blog is a shelf, and an empty shelf reads worse than no shelf.
A "Writing" nav item with two posts undercuts the restraint the rest of the site
earns — the exact failure mode this site has been pulled back from twice (see
[../redesign/CHANGELOG-REDESIGN.md](../redesign/CHANGELOG-REDESIGN.md)). Hung off a
project, a piece earns its place by being attached to a shipped thing instead of
sitting in a category waiting for siblings.

**Promotion trigger:** at **five** finished pieces, promote to a real index. Astro
content collections make that a cheap migration *later* and an expensive scaffold
*now* — so the collection gets built when there is content to put in it, not before.

---

## 2. The genre problem — read this before writing a word

"How I built X with Claude" is, as of 2026, the most saturated genre on the
internet. Most of it is worthless for one reason: **it documents the prompt and not
the judgement.** The prompt is the least transferable part. Anyone can paste it.

The site's own [anti-slop playbook](../anti-slop/06-anti-slop-playbook.md) already
frames this — *"copy that only you could write"*. Applied to build notes:

| Slop version | The piece worth writing |
|---|---|
| "I asked Claude to build a PDF viewer and it did" | Where the model confidently produced XFA handling that was wrong, and how you knew |
| Screenshot of a long prompt | The **third** prompt — after the first two failed — and why the framing changed |
| "AI 10x'd my velocity" | The one subsystem you wrote by hand, and the reason |
| A feature list | The bug that took three days and what it revealed about the format |

**The through-line for every piece: the delta.** Not what the model produced — what
you had to already know to tell that it was wrong. That is the part nobody else can
write, and it happens to be the part that demonstrates you can be hired.

This works *because* the projects have genuinely hard cores. Dynamic XFA, lag
compensation, and an undocumented save format are all domains where training data is
thin or absent, so the model's failure modes are visible and interesting. A CRUD app
build-note has nothing to say. These do.

**Corollary:** prompts are only publishable **paired** — prompt, what came back,
what you did next. A prompt on its own is a screenshot of a slot machine.

---

## 3. The spine

Same skeleton every time, so no piece starts from a blank page. Roughly 1,200–2,000
words; if it wants to be 4,000 it is two pieces.

1. **The thing that didn't exist** — one paragraph. What you wanted, why nothing did it.
   (Most of this is already written: it's the project blurb in `src/data/projects.ts`.)
2. **Why it's actually hard** — the technical core, stated plainly. This is the hook.
3. **How the work was planned** — the decomposition, before any code. Where the plan
   was right and where it survived contact with reality.
4. **Working with the model** — 2–4 *paired* exchanges. Include at least one where it
   was wrong and the wrongness was plausible.
5. **The part done by hand** — every one of these projects has one. Say which and why.
6. **What it costs to run / what shipped** — the real artifact. Link the repo, the
   live thing, a commit or diff if it makes the point.
7. **What I'd do differently** — short, specific, no false modesty.

Sections 3 and 5 are the ones readers can't get elsewhere. If a draft is thin, it is
almost always thin there.

---

## 4. The slate

Ranked. Ship in this order; **do not draft in parallel** — one finished piece beats
four half-drafts, and the first one teaches the format for the rest.

### 1. Imprimatur — dynamic XFA *(strongest, write this first)*

Adobe deprecated XFA; effectively no non-Adobe macOS reader opens dynamic
LiveCycle forms. **The angle:** building in a domain where the model has no ground
truth. Training data on XFA is thin and partly wrong, so you become the spec source
and the model becomes an implementer that must be continuously corrected. That is a
genuinely different working mode from "AI writes the app," and almost nobody has
written it up.

Concrete beats: where its XFA assumptions were confidently wrong; how you built a
corpus of real forms to test against; the Rust/Swift boundary and why it fell there.

### 2. Instagib Arena — netcode you can't eyeball

Server-authoritative sim, client prediction, lag compensation. **The angle:**
correctness only exists under latency and packet loss, so plausible-looking netcode
is the default failure. The piece is really about **building the lag-simulation rig
before the feature** — planning as the actual deliverable.

Concrete beats: the first prediction implementation that looked fine locally and fell
apart at 120ms; what "a hit registers where you saw it" costs in rewind bookkeeping.

### 3. Palhelm — reverse-engineering a save format

Undocumented binary saves, partly mapped by a community. **The angle:** hypothesis
generation vs. verification. Models are excellent at *proposing* a struct layout and
completely untrustworthy at *confirming* one — they will confabulate a plausible
format. The piece is about the discipline that keeps that from reaching production.

Concrete beats: the verification loop; a confabulated field you nearly shipped; why
the parser is Go.

### 4. startpage — where the design system came from *(shorter, different in kind)*

Taste rather than correctness, and it closes a loop: this site's paper-and-ink system
grew out of it, down to the drifting dither now running in `global.css`. Good palate
cleanser between the technical three, and the only one where the artifact is the
aesthetic. Keep it short — 800 words.

**Not yet:** ScreenCap, Vitals, Coup. Fine projects, but the build story is more
conventional; they would dilute the first slate.

---

## 5. Mining the source material

The angle depends on real transcripts, so gather before drafting:

- **Harvest per project, into `docs/writing/notes/<slug>.md`** — the prompts that
  changed direction, not the ones that worked first try. A prompt that worked is
  boring; a prompt you had to rewrite three times contains the actual lesson.
- **Keep the failures.** The wrong-but-plausible output is the most valuable asset in
  the piece and the hardest to reconstruct later. If it's still in a session log,
  pull it out now, before it's gone.
- **Pair the git history.** `git log` on each repo gives the real chronology and
  stops the piece drifting into a tidy retrospective narrative that never happened.
- **Cut ruthlessly.** Expect a 10:1 ratio — a long transcript yields one or two
  quotable exchanges. Publishing raw transcript is the single most common way this
  genre becomes unreadable.

Verbatim quotes should be short and set as blockquotes or code blocks, never
paragraph-length dumps.

---

## 6. Build plan (do this when piece #1 is drafted, not before)

Deliberately minimal — this is ~1 file plus a link, and it must not become a CMS.

- **Route:** `src/pages/[project]/[note].astro`, rendering local MDX/Markdown. No
  content collection until the promotion trigger.
- **Layout:** reuse `Layout.astro` as-is. Prose already has what it needs —
  `--measure` (34rem), serif headings, system sans body. Long-form probably wants
  three additions to `global.css`, and no more: `h3`/`h4` rhythm inside prose,
  `pre`/`code` styling on `--paper-sunk`, and `blockquote`.
- **The mark:** each note's header reuses that project's glyph from
  `src/data/marks.ts` — free, and it ties the piece back to the list visually.
- **Linking:** one quiet link in the project's `.entry-foot`, beside `source`.
  Add an optional `note?: { href, label }` to the `Project` type in
  `src/data/projects.ts`; entries without one are unchanged.
- **OG:** extend `scripts/build-assets.mjs` to bake a per-note card — the existing
  `ogSvg` template with the note title swapped in. Same generated-from-code rule as
  every other asset on this site; **no screenshot-of-text cards.**
- **Not doing:** RSS, tags, reading time, share buttons, comments, view counters,
  "related posts", an author bio block.

---

## 7. Ban list (genre-specific, on top of the site's existing one)

- Reproducing a full chat transcript
- "I'm not a real developer, I just prompt" — false, and it undercuts the work
- Velocity claims without an artifact ("built in a weekend" with nothing to open)
- Screenshots of code that should be a code block
- Tool-worship framing — the model is a subject of the piece, not its hero
- Retrofitted narrative: a plan you didn't actually follow, cleaned up after the fact
- LLM-written prose *about* using an LLM. These have a voice; the site's whole thesis
  is copy only you would write. Draft by hand; use the model to critique, not to write.

---

## 8. Definition of done

A piece ships when:

- [ ] Someone in the field would learn something they couldn't get from the README
- [ ] It contains at least one thing that went wrong, in specifics
- [ ] Every prompt shown is paired with the response and the follow-up decision
- [ ] It names the part you did by hand, and why
- [ ] It links the real artifact — repo, live URL, or a commit
- [ ] It reads in your voice out loud
- [ ] The project entry links to it, and it links back

---

## Next action

Harvest Imprimatur's transcripts into `docs/writing/notes/imprimatur.md`, tagging
each keeper as *plan / wrong-but-plausible / correction*. Draft from that, not from
memory. Nothing gets built on the site until that draft exists.
