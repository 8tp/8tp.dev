# Redesign v3 plan: client-first, fewer projects, real video

**Status:** plan, nothing built. **Drafted:** 2026-10-02.
**Research:** [research/](./research/) covers inspiration, writing, project audit, domains,
and media and components.

v2 got the look right: paper and ink, serif-led, dither plate, real captures. v3 keeps the
look and changes three things:

1. **Client work leads.** It's the thing for sale, so it goes first.
2. **The list gets shorter.** Idle toys go.
3. **The bigger apps get pages,** with trailers and short loops instead of stills only.

---

## 1. Identity and domain

**Recommendation: Hunter M. at `hunterm.dev`.**

| Layer | Value |
|---|---|
| Site | `hunterm.dev` (already yours, already on Cloudflare) |
| Email | `hunter@hunterm.dev`, with `hello@` as an alias. Needs a real sending mailbox (Fastmail, Workspace or iCloud+) with SPF, DKIM and DMARC. |
| 8tp.dev | 301 to hunterm.dev. `hunter@8tp.dev` forwards forever. Games stay on `*.8tp.dev`. |
| GitHub | @8tp, unchanged |
| Huddled | Stays the gaming handle. Not the freelance brand. |

**Why not Huddled for client work:**
- A UK dev shop called *Huddled Tech App Development* already sells the same service.
- huddled.com and huddled.dev are taken.
- Search is crowded by Slack huddles and Huddle.
- "Huddled masses" reads as hunkered down, not precise.

If you want a home for game releases later, `huddled.studio` ($31/yr) or `huddledgames.com`
($10/yr) are open.

**Why not hunterm.sh:**
- It's ~$45/yr, versus $12 for the .dev you already own.
- Cloudflare Registrar support is unclear.
- Non-technical clients will ask what .sh is.

It's fine as a vanity redirect if you like it. The only real risk with hunterm.dev is people
typing hunterm.com, which is a recruiting firm. Say "hunter-M dot dev", and write it HunterM
in print.

Other ideas that are open, if you'd rather have a studio label to invoice under (needs a DBA
or LLC): lockstep.studio, lockstepsoftware.com, framepace.studio, tickrate.studio. All have
some name collision. See [research/domains.md](./research/domains.md) for the full table.

## 2. Roster: what stays, goes, joins

These are suggestions from the audit ([research/project-audit.md](./research/project-audit.md)).
**You decide.**

| | Project | Why |
|---|---|---|
| **Client** | Aeperion storefront | Existing case. Leads. |
| **Client** | Aimperion (for Aeperion) | Live, technically deep, has a trailer and real usage. Shows an ongoing client relationship. Needs Aeperion's OK. |
| **Client** | MouseRank (for boardzy) | Live, shipped 09-28. Needs boardzy's OK. |
| **Product** | Instagib Arena | Keep. Re-capture the still, add the trailer. |
| **Product** | Palhelm (+ bot as a child) | Keep. Reuse palhelm.com's 20 s hero loop. |
| **Product** | Hatchdle | Add. Live, has a trailer. Private repo, so no source link. |
| **Product** | Imprimatur | Keep. Fix the AcroForm overclaim. |
| **Product** | Coup | Keep. Re-capture after the onboarding rework. |
| **Also (one line)** | ScreenCap, startpage, Vitals, Chudopoly | Real but secondary. Names with links only. |
| **Cut** | HudAim | Idle since March, and Aimperion supersedes it. |
| **Cut** | TypeDuel, wc26-bracket, TideWatcher, LiteStats | Idle, or the event is over. |
| **Your call** | netmap, Recopy, AntMaze | Idle but fine. Keep at most one or two in "Also", or cut. |

The rest stays off, as decided before: Still family, Fossroot, chuds-arcade, gatecrash.

## 3. Home page

One page, one column, about 1.5 screens. The order is the argument.

1. **Name.** Then one sentence on client work in platform nouns, then one on what you build
   for yourself. Draft:
   > I'm a software engineer, and I take on client work: Shopify storefronts, marketing sites
   > and web app front ends. The rest of the time I build realtime browser games, self-hosted
   > server tools and native macOS apps.
2. **A dated status line**, only if true:
   - "Booking client work from November." (the arcade.la / glenncatteeuw pattern)
   - Pair it with "Updated October 2026" in the footer, so it never goes quietly stale.
   - Plain text. No pulsing dot.
3. **Client work.** A ledger, not cards: name, one line of what you built, who it's for, and
   `→` to the case page. Aeperion carries the one image on the page.
4. **Products.** The same ledger shape. Each line links `→` to its page where one exists,
   otherwise `↗` out. The desktop hover peek stays, and plays a short muted loop where one
   exists.
5. **Also.** One line of names.
6. **Contact.**
   - Email as copyable text.
   - One line on what to send: "Send me what you're building and when you need it. If I'm
     not the right fit, I'll say so."
   - Optional: a cal.com link as the second option.
   - Optional: a floor ("Projects usually start at $X"). Every freelance site I found that
     shows pricing uses a floor, never a rate card.

**Kept from v2:** dither plate, theme toggle, real colour logos, real captures only, no years,
no chips, no stack pills.

## 4. Project pages: `/work/<slug>`

These are only for things that have a story. Each page is short: a meta row, a paragraph, the
media, and captioned details. This is the cody.software / hunterjennings.dev format: dev case
studies are short, and long narratives belong to consultants.

| Page | Contents |
|---|---|
| `/work/aeperion` | **The one full case.** Meta row: client, role, stack, live link, credits. Then a paragraph on the "before" as checkable facts (with the client's OK), and a paragraph on what was built, described mechanically. Then 4–6 captioned details: compare page, PDP, theme-editor sections, light/dark. Aimperion as a section or a sibling page. One real quote from Axilyn if you can get it. |
| `/work/instagib-arena` | Trailer inline, plus a "Play now ↗" link. Netcode in plain words. This is where the planned build note `/work/instagib-arena/netcode` hangs (see [../writing/00-plan.md](../writing/00-plan.md)). |
| `/work/palhelm` | Hero loop, dashboard captures, the save-file parsing story. |
| `/work/hatchdle` | Trailer, plus how the server-side roll works. |
| `/work/imprimatur` | XFA captures. Hosts the planned `/xfa` build note. |
| `/work/mouserank` | Later, once boardzy agrees. |

**Build:**
- An Astro 6 MDX content collection keyed by the `projects.ts` slug.
- A `CaseStudy.astro` layout.
- A per-page OG image built with sharp from the graded still.
- Native cross-document View Transitions, so the list title morphs into the page heading and
  the hover peek grows into the hero. Firefox just navigates.

The code shape is in [research/media-and-components.md](./research/media-and-components.md).

## 5. Video

You already have the trailers: Instagib (92 s), Aimperion (80 s) and Hatchdle (67 s), all
1080p60 in `~/Downloads`.

**Copy their working media out of `/tmp` now.** That's `/tmp/ig-trailer`, `/tmp/aimtr` and
`/tmp/hatchtr`, and it can be wiped at any time.

| Use | Format | Where |
|---|---|---|
| Hover peek / in-view loop | 6–8 s muted, AV1 + H.264, ~0.5–1.5 MB, poster = first frame | List peek, page hero |
| Trailer | 1080p with sound, re-encoded from 50–147 MB down to roughly 10–25 MB, 720p source for phones | `<dialog>` from the list, inline on the page |
| Discovery | Same trailer on YouTube | Linked, not embedded |

- **Hosting:** R2 bucket behind `media.hunterm.dev`. Cost is ~$0. Content-hashed and
  immutable. Not in git.
- **Player:** native `<video>`. Video.js 10 is the upgrade path if native controls clash with
  the look. Skip Vidstack and Plyr; both are being retired.
- **Rules:**
  - `preload="none"`.
  - Never autoplay under reduced motion or Save-Data.
  - A visible pause control on any autoplaying loop.
  - Captions or a one-line description.
- **Pipeline:**
  - A new `scripts/build-clips.mjs` with a `CLIPS` manifest. It encodes, applies the same
    grade as the stills, extracts the poster frame (so the still and the loop can't drift),
    hashes the files and writes `src/data/media.ts`.
  - `pnpm media:push` uploads to R2.
  - DOM apps are captured with CDP screencast. Games are recorded by hand on the GPU.

## 6. Writing

Full rules and drafts are in [research/writing.md](./research/writing.md). The short version:

- **Kill every em dash.** There are ~10 in visible copy now, even though they were banned in July.
- **No agency register:** "help brands", "end-to-end", "solutions", "product storytelling".
- **Real numbers only.** With no baseline, describe the work mechanically.
- **Client brand lines belong to the client.** Check client positioning rules before writing
  a case.
- **Two sentences per blurb.**

## 7. Components and type

- **Platform first:** `<dialog>`, popover, scroll-driven animations, view transitions.
- **Bits UI** only if a real widget appears.
- **No Tailwind kits** (shadcn-svelte, Skeleton, Svelte Bits, Aceternity ports). They're where
  the generic look comes from.
- **Keep the system serif.** Instrument Serif is now called out on X as an AI tell. So are
  glassmorphism, eyebrow labels, bento grids, Inter/Geist and monospace-everywhere.
- **Optional personal touch,** if the page ever feels too bare: andrewallsop.com rotates
  captioned paintings in the margin. Something in that spirit fits the dither plate. One
  thing, not five.

## 8. Don't repeat

These were tried and reverted in v1/v2:
- the magazine/terminal conceit;
- Helvetica display;
- generated thumbnails;
- GitHub stats feeds;
- the sticky preview column and per-frame cursor easing;
- per-entry years, chips and case bullets;
- the H monogram;
- the Wayback "before" shot;
- a blog/Writing nav item.

Details are in [research/writing.md](./research/writing.md) and
[../redesign/CHANGELOG-REDESIGN.md](../redesign/CHANGELOG-REDESIGN.md).

## 9. Phases

| # | Phase | Ships |
|---|---|---|
| 0 | **Housekeeping** | Copy trailer media out of `/tmp`. Check who runs `arcade.8tp.dev` ("Arcade games by Aodom"; no matching repo, possible stale DNS). Ask Aeperion and boardzy whether you can show their work. |
| 1 | **Domain** | Set `site.url`/`site.email` in `src/data/site.ts`, `public/CNAME`, Cloudflare redirect rule 8tp.dev → hunterm.dev, mailbox and DNS records. Update the GitHub website field. |
| 2 | **Copy and roster** | Rewrites, cuts, add Hatchdle (and Aimperion once approved). Pure data edits in `projects.ts`/`clients.ts` plus the Intro and Contact components. |
| 3 | **Home restructure** | Client work first, status line, ledger, Also line, contact floor/cal link. |
| 4 | **Media** | R2 bucket, `build-clips`, re-capture Instagib/Coup/Aeperion stills, loops in the peek, trailer dialog. |
| 5 | **Project pages** | Content collection and layout. Aeperion first, then Instagib, Palhelm, Hatchdle, Imprimatur. Per-page OG. View transitions. |
| 6 | **Later** | Build notes ([../writing/00-plan.md](../writing/00-plan.md)), MouseRank case, ScreenCap preview. |

Phases 1–3 make a shippable site on their own. Phases 4–5 are where most of the work is.

## 10. Open questions for Hunter

1. Domain: hunterm.dev as primary? Anything for Huddled now, or later?
2. Roster: confirm the cuts, and pick from netmap / Recopy / AntMaze.
3. Can Aimperion, MouseRank, and the Aeperion "before" facts be public?
4. Availability line: what's true, and when?
5. Pricing floor: show one or not? A cal.com link or email only?
6. Trailers: also publish on YouTube?

---

## Decisions (2026-10-02)

1. **Domain:** the site stays on 8tp.dev for now. hunterm.dev is owned and on Cloudflare; the
   switch is phase 1 (DNS, mailbox, `site.url`/`site.email`, `public/CNAME`, a 301 from 8tp.dev).
2. **Roster:** the cuts are agreed. netmap, Recopy and AntMaze are off too.
   - Client work is Aeperion, with Aimperion nested under it, and MouseRank for boardzy.
   - Hatchdle and Chudopoly are featured own projects.
   - Arcade is off until its rebrand to tixy.lol ships; then it comes back as a design-lead
     collaboration with Odom.
3. **Client permission:** Aimperion and MouseRank can be shown, and the Aeperion case can describe
   the old store's problems.
4. **Availability:** "I'm taking on client work now", with "Updated <month>" in the footer.
   Edit `site.availability` / `site.updated` in `src/data/site.ts`, or set the former to null.
5. **Contact:** email only. No price, no booking link for now.
6. **Trailers:** upload to YouTube and set the `trailer` id on the project or client case. A
   "Trailer" button then opens it in a dialog, using youtube-nocookie and loading only on click.

## Built on `redesign-v3` (home page)

- **Letterhead and grid:** a letterhead header and a two-column grid (label column + content),
  with a serif lede and body text in near-full ink.
- **Client work first:** prose cases with real captures. Aimperion is nested under Aeperion.
- **Own projects as a ruled ledger:** name link, Play/Visit/Source out-links, and the
  hover still kept. The "Also" line closes the section.
- **Fresh captures:** Instagib, Coup, MouseRank, Hatchdle, Aimperion and Chudopoly, plus
  logos for the new entries. TypeDuel/HudAim/TideWatcher/AntMaze/wc26 assets were removed.

Next: phase 1 (domain), the trailer ids, then project pages (phase 5).

## Round 2 (2026-10-02)

- **Plainer copy:** project and client copy rewritten to say what each thing is and does,
  with no implementation detail.
- **Tech rows:** each project and client case shows its tech with logos (Simple Icons, CC0,
  mapped in `src/data/stack.ts`). Brand colours that vanish on either paper fall back to ink.
- **Icons:** GitHub and mail glyphs on the header links, the contact email and Source links.
- **Animated backdrop, rebuilt on WebGL.** The CPU canvas version lagged. Each variant is now
  one fragment shader in `src/lib/backdrops.ts`, hosted by `src/components/Backdrop.astro`.
  Choose one with `site.backdrop`, or preview with `?bg=`:
  - `contours` (default): muted topographic lines.
  - `window`: blind and leaf shadow by day, light through the window at night.
  - `paper`: a low light raking across paper grain.
  - `marbling`: suminagashi rings.
  - `guilloche`: an engraved rosette off the right edge.
  - `dither` / `none`.

  Research for this is from Grok on X plus web sources. The findings were:
  - Paper and light directions read as fresh.
  - Dither, glass and mesh gradients read as 2026 slop.
  - Caustics were dropped because they read as a swimming pool.

## Round 3 (2026-10-02)

- **Favicon:** a lowercase serif h (outlined from Source Serif 4 Semibold, OFL) in paper on an
  ink tile, in both themes. It replaces the capital H, which read like the Hinge logo.
- **Dark-mode screenshots:**
  - Captures can emulate `prefers-color-scheme` (the `scheme` field in `capture-stills.mjs`).
  - MouseRank, Palhelm and Chudopoly have dark captures, graded on the dark ramp. Aeperion
    already had them.
  - The hover still picks the dark one when the page is dark.
  - Hatchdle has no dark theme, so it keeps one image.
- **Scrolling client frames:** Aeperion and MouseRank use full-length page captures (`tall` in
  `build-assets.mjs`). The frame shows the top screen and scrolls down the page on hover, focus
  or tap.
- **Hover still swing:** the still tilts slightly with sideways cursor speed, hanging from the
  corner nearest the cursor. Off under reduced motion.
