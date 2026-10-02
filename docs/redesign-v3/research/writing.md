# Writing rules for v3

Merged from the house voice docs written for client and side projects. Sources:

- **[V]** `~/src/sites/Aimperion/docs/voice.md` (the Aeperion house style)
- **[H]** `~/hatchdle/docs/voice.md` (extends [V] with late-2026 tells)
- **[AC]** Aeperion commits `8735835` "Plain-language copy pass", `dcf0732` "About: the same ideas in plain words"
- **[CL]** `docs/redesign/CHANGELOG-REDESIGN.md`, **[W]** `docs/writing/00-plan.md`
- **[CJ]** house rule at the top of `src/data/clients.ts`

Where these disagree with `docs/anti-slop/06-anti-slop-playbook.md` on *copy*, these win.
The playbook's copy templates ("Ship [artifact] without [pain]") are themselves fill-in-the-blank.

## Banned

- **Words**: seamless, robust, leverage, delve, elevate, empower, streamline, harness,
  cutting-edge, game-changer, unlock, journey, realm; serves as / boasts / features (for is/has);
  genuinely, simply, truly, remarkably, purely, fully, honestly; "this matters", "it's worth
  noting"; "can help you", "happy to". [V][H]
- **Agency register**: "I help brands…", end-to-end, solutions, bespoke, pixel-perfect,
  partner with you, product storytelling, "Let's build something great together".
- **Structures**:
  - Em dash as glue (there are ~10 in visible copy now, despite `d104a3c` banning them).
  - "Not X, it's Y" and all its cousins. [V][H][AC]
  - Rhythm triplets; "-ing" tails; question-then-answer hooks; colon-then-reveal. [V][H]
  - Mannered metaphor. [H][AC]
  - Headline periods; Title Case labels; emoji. [AC][V]
  - Template chrome: eyebrow labels, 01/02/03 counters, three-up icon cards, stack pills, skill bars. [H][CL]

## Required

- Plain verbs, a named actor, one idea per sentence, contractions. [V][AC]
- Numbers over adjectives, **only real ones**. With no baseline, describe the work mechanically. [V][CJ]
- Use the product's own nouns and name what ships, not the category. [V][AC]
- Say who it's for, not what it promises. [AC]
- Two sentences max per blurb, and at most one or two numbers each.

## Client-facing copy

1. The client's brand lines are the client's. Don't quote them as your copy. [AC]
2. Respect per-client positioning rules (e.g. Shimo is never "control" or "slow"). Read
   `aeperion-drive-archive/extras/claude-memory/axilyn-call-729.md` before writing the case.
3. Describe the "before" with checkable facts, not a screenshot. Examples:
   - Don't cite the Shimo pad's demo specs: the product wasn't live yet, so it says nothing
     about the old store.
   - The nav was Home / Discord / About us.
   - There was a 16.3 MB `og:image`.

   Use one or two of these, and **get Axilyn's OK first**, because saying the old store was
   broken is a relationship call. A Wayback "before" shot was already rejected because it
   misrepresented the store. [CL]
4. Describe the work mechanically: "a compare page that ranks the three cloth pads from
   control to speed", not "product storytelling".
5. The role string must be true; decide it deliberately ([CL] open item 3).
6. The services line uses the platform's own nouns: "Shopify themes and sections, marketing
   sites, the front end of web apps."
7. Only show availability if it's true and dated. No fake scarcity, and no promised response time.
8. The CTA asks for concrete inputs (what you're building, when). Email is the one primary action.
9. Testimonials only if real, named and approved, and only one or two of them.

## Rewrites of current copy (drafts; verify every fact)

**Intro**
> I'm a software engineer, and I take on client work: Shopify storefronts, marketing sites
> and web app front ends. The rest of the time I build realtime browser games, self-hosted
> server tools and native macOS apps.
>
> Most of it started because I wanted it: a server I ran needed an admin panel, and a game
> I wanted to play had no browser version.

**Contact**
> Send me what you're building and when you need it. If I'm not the right fit, I'll say so.

**Aeperion**
> Aeperion makes gaming mousepads. Its store ran a free Shopify theme at default settings. I rebuilt it on a fork
> of Shopify's Horizon theme for the August 3 Shimo preorder launch: a page per pad, a
> compare page that ranks the cloth pads from control to speed, and sections the owner
> edits in the theme editor. I still work with them, and also build their aim trainer, Aimperion.

(Cart unification and the 3 MB asset cut are v2 work, which isn't live yet. Don't claim them.)

**Instagib Arena**
> Quake-style instagib in a browser tab: one-shot railgun and strafe-jumping. The server is
> authoritative and rewinds for lag, so a hit registers where you saw it.

**Palhelm**
> Self-hosted control panel for Palworld servers, in one Docker container. It reads players
> and Pals straight from the undocumented save file, and adds a world map, an RCON console
> and scheduled backups.

**Imprimatur** (the current "forms other Mac apps can't — AcroForms" overclaims, since Preview opens AcroForms)
> A native macOS PDF app that fills dynamic XFA forms (Adobe LiveCycle), which Preview and
> other non-Adobe Mac readers can't open. It handles ordinary forms, markup and signing
> too, and files never leave the Mac.

**Coup**
> The bluffing card game, in a browser. Share a room code and play on any device; bots fill
> empty seats, and nobody needs an install or an account.

**Aimperion** (new)
> A browser aim trainer I build for Aeperion. It reads raw mouse input, and the server
> replays every run from its input tape before ranking it.

**Hatchdle** (new)
> One egg a day: tap it and see what hatches. 36 creatures from 1 in 2 to 1 in 512, rolled
> on the server so a refresh can't reroll.

**Meta description**
> Hunter M. builds Shopify storefronts and web front ends for clients, plus realtime
> browser games, self-hosted tools and native macOS apps.

**OG alt**: describe the image ("Hunter M., set in serif on dithered paper"), not the pitch.
