# Redesign changelog

**Date:** 2026-08-04
**Brief:** [OPUS-PROMPT.md](./OPUS-PROMPT.md) · **Design system:** [05-design-system.md](./05-design-system.md)

The terminal/magazine site is gone. What replaced it is a document: warm paper,
serif headings, 15px system sans, and a list of work you can read top to bottom
without a single card, badge or numbered section label.

---

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
```

Two optional asset commands, neither needed for a normal build:

```bash
pnpm stills     # re-capture live product screenshots into assets-src/ (gitignored)
pnpm assets     # regenerate favicons, OG card, and graded stills into public/
```

---

## What to change later (the three knobs)

| You want to change | Edit | Notes |
|---|---|---|
| **Domain** | `src/data/site.ts` → `url` | `astro.config.ts` imports it, so canonical links, OG URLs, `robots.txt` and the sitemap all follow. If you deploy on GitHub Pages, also update `public/CNAME` — that file is a DNS target, not site config. |
| **Email** | `src/data/site.ts` → `email` | Used by the intro, the contact block, the footer and the JSON-LD. |
| **Avatar** | drop a square image at `public/avatar.jpg` | Nothing currently renders one — the page is deliberately faceless. See [04-profile-image.md](./04-profile-image.md); many dead-simple portfolios ship no photo at all. |

`hunterm.dev` appears nowhere. `8tp.dev` appears only in `site.ts`, `public/CNAME`,
and the product subdomains that genuinely live there.

---

## The second pass — why it looks different from the first build

The first build had a huge thin name over a tagline over three CTA buttons, mono
all-caps section labels numbered `01`–`06`, stack pills, and cards with borders
and shadows. That is the shape a language model reaches for by default, and it
read as exactly that. It was rebuilt against the actual references.

**What I looked at, rather than guessed:**

- **[omarabdulrahim.com](https://omarabdulrahim.com/)** — driven in a headless
  browser and inspected. Entries are 14px system sans, bold name + grey year,
  two lines of description, no chips. Section labels are plain sentence case
  ("Selected professional work", "Side hacks"). The hover is a `hover:bg-stone-300`
  wash on the whole entry, with `py-2 px-3 -my-2 -mx-3` so the wash bleeds
  without shifting layout, and an `<img>` **injected into the DOM on hover**,
  `position:absolute`, ~308×173, 6px radius, **no shadow**,
  `transition: opacity .25s, scale .25s`, translated to follow the pointer.
- **[deadsimplesites.com](https://deadsimplesites.com/)** — 14–16px throughout.
  No display type at all in its own chrome.
- **[aeperion.com](https://aeperion.com)** — for the theme control (below).

**What changed as a result:**

| Removed | Replaced with |
|---|---|
| `01 SPOTLIGHT` mono all-caps labels with rules | `Selected work` — serif, sentence case, no number, no rule |
| Hero: 3.5rem/300-weight name + tagline + 3 buttons | Name at 1.5rem serif, then a first-person paragraph with the email inline |
| Stack pills | `Three.js · React 19 · Node/ws · SQLite` as plain 13px text |
| Cards, plates, borders, drop shadows | Nothing. The page has one border-radius, on images |
| Helvetica Neue at display sizes | `ui-serif` for the name and headings, `ui-sans-serif` at 15px for everything you read |
| A sticky preview rail in its own column | The pointer-anchored hover preview described below |

---

## Structure

```
Hunter M.          serif, 1.5rem · intro paragraph · email inline
Selected work      Instagib Arena, Palhelm, Palhelm Bot, Coup, Vitals,
                   TypeDuel, HudAim, ScreenCap — one flat list
Client work        Aeperion storefront redesign
Utilities          netmap, TideWatcher, LiteStats, Recopy — two up
Also built         AntMaze, wc26-bracket, startpage — two up
Contact            one sentence, the address, a copy button
Footer             GitHub · All repositories · Email · name · host · year
```

Tiering lives in `src/data/projects.ts` (`tier`, `kind`, `parent`, `preview`);
the client case in `src/data/clients.ts`. Palhelm Bot renders directly under
Palhelm rather than as a peer, via `parent`.

**Not featured, deliberately:** the Still / still-\* family, forks, DevDock, DTAK,
ghgarden, and the thin toys. `github.com/8tp` is the escape hatch.

---

## Design system

Tokens are the source of truth (`src/styles/global.css`).

- **Palette** from the startpage: `--paper #f6f6f3` / `--ink #171816`, dark
  `#101411` / `#e8eae5`. One hue, no accent colour.
- **Type:** `ui-serif` (New York on Apple, Iowan/Charter/Palatino/Georgia
  elsewhere) for the name and section headings; `ui-sans-serif` at **15px** for
  body. **Still zero webfont requests.**
- **Scale:** 13 / 14 / 15 / 17 / 24px. Nothing larger — this is a document.
- **Shape:** no cards. One radius, 6px, on images and the hover wash.
- **Texture:** the startpage's dot-dither, fixed and faded down the page. It is
  the one decorative element and it comes from your own work.
- **Motion:** the hover wash, the preview fade, and the theme dot. Everything
  collapses under `prefers-reduced-motion: reduce`.

### One deliberate departure from the design doc

`05-design-system.md` specifies `"Helvetica Neue", Helvetica, Arial` at weight
300 for display. Built literally, that is the exact tell that reads as
AI-generated. The serif/system split keeps the doc's intent — quiet, no brand
hue, typography as the only identity — with a face no generated portfolio ships.

The doc's ink ramp also sets `--ink-soft` at 38%, which measures **2.4:1** on
paper — a WCAG AA failure at 13px. Ramp is now 64% / 46%, with a fourth level
`--ink-line` (32%) for link underlines, and `--ink-soft` reserved for separators.

---

## Hover previews

`src/components/EntryList.svelte`, modelled directly on Omar's implementation.

- **The whole entry is the link.** Hovering washes the block —
  `padding: .5rem .75rem` against `margin: 0 -.75rem`, so the wash bleeds past
  the text and nothing moves.
- **The preview follows the pointer** inside the entry, offset +20/+18px.
  `translate` is deliberately *not* transitioned — it tracks live, while only
  `opacity` and `scale` animate, over 250ms. Same split Omar uses.
- **Genuinely lazy.** The `<img>` element does not exist until first hover.
  Verified in the browser: `document.querySelectorAll('.peek').length` is `0` on
  load, and after hovering one entry only that entry's image exists.
- **Cannot block a click.** `pointer-events: none` — `elementFromPoint` at the
  preview's centre returns the `source` link behind it.
- **Desktop only.** `client:media="(min-width: 52rem) and (hover: hover) and (pointer: fine)"`,
  and `.peek` is `display: none` outside that query, so touch devices neither
  hydrate the island nor fetch anything.
- Entries without a still (ScreenCap, the utilities, wc26-bracket) simply have
  none. No generated stand-ins.

**startpage** is featured under *Also built* with its own preview — captured by
cloning the repo and opening `index.html` from `file://`, so the dithering
shader is really running in the shot.

---

## Theme switcher

Ported from **aeperion.com**, not the startpage — `src/components/ThemeToggle.svelte`.

An eclipse: a `0.875rem` hairline circle with `background: linear-gradient(90deg,
currentColor 0 50%, transparent 50% 100%)`, so one half is filled. On dark it
takes `transform: rotate(180deg)` and the fill swaps sides.

The details that came with it and are worth keeping:

- The transition uses `--ease-in-out` (`cubic-bezier(0.76, 0, 0.24, 1)`), which
  is used **here and nowhere else on the site**. Aeperion's own comment explains
  why: a reversible state is the one case where the return leg should read as
  the exact undo of the outbound one, not as its equal.
- `:active { transform: scale(0.88) }` — a real press.
- Hidden with `visibility`, not `display`, until the island hydrates: the box
  stays reserved so the header cannot shift, and there is never a dead control
  for anyone without JS.
- A 32px dot with a 44px hit target, via a `::after` inset.
- The label names the action (`Switch to dark theme`) and there is no
  `aria-pressed` to contradict it.

Theme resolves before first paint from a head script, persists to
`localStorage`, follows the OS until you choose, and rewrites `theme-color`.

---

## Assets — all owned, all generated

Everything under `public/` comes from `scripts/build-assets.mjs`.

| Asset | Notes |
|---|---|
| `favicon.svg` | Paper **H** knocked out of an ink tile, with a `prefers-color-scheme` swap inside the SVG |
| `favicon.ico` | Real multi-image ICO (16/32/48), hand-encoded PNG-in-ICO |
| `favicon-16/32.png`, `icon-192/512.png`, `apple-touch-icon.png` | From the same source; the touch icon is flattened onto opaque paper |
| `og.png` | 1200×630 — "Hunter M." set in the same serif on dithered paper |
| `site.webmanifest` | New |
| `public/projects/*.webp` | Eight real product screenshots |
| `public/clients/aeperion-after.webp` | The live storefront today |

### The old thumbnails were fake, and they are gone

Every image in the old `public/projects/` came out of a `gpt-image-1` script
(`CODEX_THUMBNAILS.md`, deleted) for "cohesive Tokyo-Night artwork". They were
not screenshots — the body text in the netmap and tidewatcher tiles is gibberish
under magnification, and `recopy-bw.webp`, which was live on the site, had the
**old `chuds.dev` domain baked into the pixels**. All 24 were deleted along with
`banner.webp` and the 1.39 MB `manga-workspace.png`.

They were replaced with captures of the running products (`pnpm stills`, headless
Chromium over CDP, clicking past splash screens to reach a representative
screen), cropped to one legible region and tone-mapped onto the page's own
ink→paper range — saturation 0.62 so a trace of the product's own hue survives,
blacks lifted to ink so a dark screenshot sits *on* the sheet.

`public/` went from roughly 1.8 MB to about 320 KB.

---

## Copy

Descriptions came from your own words in the old `projects.ts`, tightened.
Vitals, wc26-bracket and startpage are new and were written from their READMEs —
worth a read, since they have not been through your voice. All fifteen live URLs
returned 200 and were confirmed to be real project content.

The Aeperion case study is built only from what is verifiable in the project repo
or on the live storefront. **There are no metrics in it, deliberately**: no
Lighthouse run or analytics baseline exists, so the performance work is described
mechanically. `startpage`'s README says "zero dependencies" but vendors several
libraries, so the copy says "no build step" — the claim the README supports.

---

## Accessibility

- Contrast: every ink level carrying text clears WCAG AA at 13–15px (arithmetic
  above). `--ink-soft` is separators only.
- Lists carry explicit `role="list"` (Safari/VoiceOver drops list semantics from
  `list-style: none`).
- Repeated links are labelled — `aria-label="ScreenCap source"` — so a link list
  does not read as five identical "source"s.
- `<main tabindex="-1">` so the skip link moves focus, not just the viewport.
- The preview is `aria-hidden` with an empty `alt`: it is decoration, and the
  entry text already says what it is.
- The copy-email button appears only when a clipboard exists; without JS the
  address is plain selectable text.
- **Known and accepted:** external links use `target="_blank"` without an "opens
  in a new tab" announcement. On ~25 links that is noisier than it helps, and the
  requirement is WCAG AAA.

Verified in-browser under `prefers-reduced-motion: reduce`: transitions collapse
to `0.01ms` and no element is left mid-animation.

---

## Anti-slop screenshot tests

| Test | Result |
|---|---|
| Remove the logo — still a specific person? | **Pass.** No logo exists. The identity is a serif name, a first-person paragraph, and eight real product screenshots. |
| Custom, product-relevant visuals > 0? | **Pass.** Nine, all real captures; zero generated art. |
| Hierarchy survives in grayscale? | **Pass.** Single-hue already. |
| Typefaces nameable? | **Pass.** New York (or Iowan Old Style / Georgia) and the system sans. No Inter, no Helvetica display. |
| One clear primary action? | **Pass.** The email address, in the intro and again in Contact. |
| `prefers-reduced-motion` respected? | **Pass.** Verified in-browser. |
| Mobile density intentional? | **Pass.** 390px: no horizontal overflow, no hover UI, single column. |
| Would this look like ten other AI portfolios? | **Pass**, and this is the test the first build failed. No numbered sections, no CTA button row, no pills, no cards, no display-weight grotesque, no purple, no bento grid, no skill bars. |

---

## Stack changes

- **Tailwind 4 removed.** The design docs allow "clean CSS variables first —
  tokens win"; for a one-page document, hand-authored CSS beats utility soup.
  Astro 6 + Svelte 5 islands unchanged, as required.
- **Three islands, each earning its place:** the theme toggle, and the two entry
  lists that carry hover previews. The utilities list ships as static HTML with
  no JS at all.
- `astro.config.mjs` → `astro.config.ts`, so it can import `site.url`.
- `robots.txt` is generated (`src/pages/robots.txt.ts`) with the sitemap URL
  built from `site.url`.
- **CI was fixed, not just left alone.** `.github/workflows/deploy.yml` still ran
  `pnpm github:data` — a script this rewrite deleted — which would have failed
  every deploy. That step and the nightly `schedule:` that fed it are gone.
  `pnpm-workspace.yaml` also had literal `set this to true or false`
  placeholders, which makes `pnpm install --frozen-lockfile` exit 1.
- **Removed:** `src/data/github.ts`, `scripts/update-github-data.mjs`, the four
  thumbnail generators, the `CODEX_*.md` docs, and every component from the old
  site.

---

## Open items for you

1. **Aeperion "before" frame.** `src/data/clients.ts` has a `before` slot with an
   `expectedPath`; set its `src` and it renders above the "after". Right now the
   case says "Before — stock theme, capture pending" as a line of text rather
   than showing an empty box. I found a pre-redesign snapshot in the Internet
   Archive (`web.archive.org/web/20260514055904/https://aeperion.com/`) and
   captured it, but **none of the product imagery archived** — the hero renders
   black and the product cards are empty grey boxes. Shipping that would make the
   old store look worse than it was, which is the same sin as inventing a metric.
2. **Client image rights.** `clients/aeperion-after.webp` is a screenshot of the
   public storefront; the licensed Shimo character art appears in it as part of
   the product. Standard portfolio practice, but worth a note to the client.
3. **Case study attribution.** The role reads "Design and front-end build".
   Several commits in the Aeperion repo describe delegated/agent-assisted work;
   if you would rather say "led and shipped", that is one string in `clients.ts`.
4. **wc26-bracket** has a working GitHub Pages deploy at
   `https://8tp.github.io/wc26-bracket/` that its README does not mention. I
   linked only the source in case that deploy was not intentional — add
   `website` to its entry if it was, and it can take a hover preview too.
5. **AntMaze has no preview** — the capture only caught its title screen before
   the maze renders. `pnpm stills` with a click step would fix it.
6. **Rotate the Shopify theme token** in
   `~/src/sites/aeperion-drive-archive/SETUP.md`. Nothing from it is in this
   repo, but it is plaintext on an unencrypted drive and the file says so.
