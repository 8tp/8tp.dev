# design.md — Portfolio redesign (source of truth)

> Agents must treat this as the design system. Anti-slop pack: `docs/anti-slop/`.

---

## Product

- **Name:** Hunter M. (personal portfolio) — **not** “8tp brand studio”
- **One-line truth:** Ships realtime browser multiplayer, self-hosted tools, native utilities, and commercial web craft.
- **Primary CTA:** View work · Contact (email)
- **Audience:** Freelance clients first; technical peers second
- **Secondary:** GitHub @8tp as engineering handle only

---

## Aesthetic thesis (ONE)

- [x] **Swiss calm / paper-and-ink editorial** (Dead Simple Sites + startpage DNA)
- [ ] Grainwave cinematic SaaS — **no**
- [ ] Neon terminal magazine — **no** (current site direction; retiring)
- [ ] Neo-brutal — **no**

**In one sentence, the site should feel like:**  
> Warm paper, careful type, quiet motion — a personal startpage that grew a portfolio, not a SaaS landing or a gamer HUD.

---

## Positive references

| Ref | Steal |
|-----|-------|
| [deadsimplesites.com](https://deadsimplesites.com/) | Density, whitespace, anti-scroll-jack, type hierarchy |
| Personal startpage (`github.com/8tp/startpage`) | Paper/ink tokens, dither backdrop, control shadows, light display type, theme toggle, restrained CSS motion |
| Examples on DSS (e.g. leerob.com, frankchimero.com-class calm) | Name-forward pages, few sections, high craft |
| aeperion.com | Commercial polish bar for case study *content* (do not copy brand) |

## Negative references (never)

- Purple / indigo gradients, glassmorphism everywhere  
- Inter / Roboto as primary identity type  
- Tokyo Night / neon terminal chrome as default theme  
- Equal bento of 12 repo cards with Lucide icons  
- “Build the future” / “Unlock potential” copy  
- Abstract AI blobs, neural orbs, stock laptop smiling  
- Heavy 8tp logo / mascot / cyber branding  
- Scroll-jacking, full-page parallax theaters  
- Skill percentage bars  

Full ban list process: `docs/anti-slop/06-anti-slop-playbook.md`

---

## Typography

| Role | Family | Weight | Notes |
|------|--------|--------|-------|
| Display / name | `"Helvetica Neue", Helvetica, Arial, sans-serif` or similar neo-grotesk | 300–400 | Startpage clock energy; large, tight tracking slightly negative |
| Body | Same family or system UI sans | 400–500 | High legibility; muted secondary text |
| Mono / meta | `ui-monospace, SF Mono, Menlo, Consolas` | 400 | Labels, stack chips, foot notes — sparingly |

**Type rules:**

- Hero name: `clamp(2.5rem, 6vw, 3.5rem)`, weight 300  
- Section labels: small, mono or caps tracking, muted  
- Body: ~16–17px, line-height ~1.55  
- Max content width: ~40–46rem for reading; project grid may go slightly wider (~64rem)  

---

## Color (max 5 core)

Lifted from startpage paper/ink (adjust only if needed):

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--paper` | `#f6f6f3` | `#101411` | Background |
| `--ink` | `#171816` | `#e8eae5` | Primary text |
| `--ink-muted` | ink @ 59% | same idea | Secondary |
| `--ink-soft` | ink @ 38% | | Tertiary / meta |
| `--ink-faint` | ink @ 12% | | Borders / rules |
| `--control` | `#ffffff` | `#191e1a` | Cards / controls |

**Rules:** flat first · no default indigo · accent = ink, not a second brand color · optional single warm accent only if essential for live badges  

---

## Shape language

- **Radius:** ~0.55rem controls, ~0.8rem large cards (startpage scale) — not 16px everywhere  
- **Borders:** faint ink hairlines  
- **Shadows:** soft control shadow (startpage `--control-shadow`) — one language  
- **Backdrop:** optional dither shader (paper-design/shaders) at low opacity, masked quiet; fallback CSS grain/dot  

---

## Spacing

- Base: 8px  
- Section rhythm: generous (clamp 3–6rem vertical)  
- Shell: `width: min(100%, 46rem)` for text; grid sections `min(100%, 64rem)` if needed  
- Mobile: safe-area padding; no cramped card walls  

---

## Motion budget (max 2 signature moments)

1. **Staggered entrance** of hero + first section (CSS, startpage school)  
2. **Hover language** on project cards / links (lift or ink underline — pick one)

- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`  
- Honor `prefers-reduced-motion: reduce` (disable stagger / shader animation)  

Realtime multiplayer micro-interaction is **optional third** — only if quiet; not required for v1.

---

## Imagery

- **Style lock:** Product screenshots (real), Aeperion case frames, B&W or paper-graded project thumbs; optional monogram  
- **Profile:** See `04-profile-image.md` — editorial, not cyber  
- **Banned:** generic AI blobs, Tokyo Night thumbnails as system, neon mockups  

Project thumbs: prefer quiet UI crops or real product stills over abstract accent art.

---

## Icons

- Minimal: simple monochrome SVG, currentColor  
- Prefer no icon decoration on every card  
- Social: GitHub mark only if needed  

---

## Components (thin set)

1. Layout shell + theme toggle  
2. Hero (name, thesis, CTAs, optional avatar)  
3. Spotlight block (large, 1–2 per)  
4. Project card (name, one sentence, stack, links)  
5. Client case (before/after slots, bullets, live link)  
6. Compact utilities list  
7. Contact block  
8. Footer  
9. **Hover preview** (desktop enhancement for visual projects only)

No marketing pricing tables, no fake logos row, no newsletter.

---

## Hover preview spec (Omar-style, restrained)

Inspired by quiet side-project previews on sites like [omarabdulrahim.com](https://omarabdulrahim.com/) (via Dead Simple Sites) — **not** a cursor-chasing Awwwards theater.

### When to show

| Use hover preview | Skip |
|-------------------|------|
| Spotlights (Instagib, Palhelm, Coup) | Utilities (netmap, tidewatcher, …) |
| Featured visual products (TypeDuel, ScreenCap, Vitals, games) | Bots / pure backends |
| Client case (Aeperion still / before-after) | Text-only “also” links if no asset |

Data model: `preview?: string` (image path) and/or `previewVideo?: string` (optional short muted loop). `preview: false` or omit = no hover media.

### Behavior

- **Desktop only** (`hover: hover` / pointer fine): on row/card hover or focus-within, fade in a **fixed-size preview** near the card (card-local or anchored — prefer **not** free cursor-follow for v1)  
- **One image** (WebP) primary; optional silent loop only for 1–2 spotlights max  
- Soft control shadow, paper-consistent crop, ~280–360px wide  
- Motion: opacity + slight translate only; easing startpage-like; **≤200–280ms**  
- **Lazy:** load preview src on first hover or when card enters viewport  
- **`prefers-reduced-motion`:** no animated reveal; optional static thumb inline or none  
- **Mobile:** no hover UI; optional small static thumb in card layout or none  
- Never block click-through to Play/Visit  

### Anti-patterns

- Preview on every list row including TUIs  
- Autoplay sound, heavy MP4 everywhere  
- Scroll-jack or full-viewport takeover  
- Generic abstract AI thumb instead of real product UI

---

## Stack

| Choice | Why |
|--------|-----|
| **Astro + Svelte 5 islands** (current) | Perfect for static portfolio + optional interactive islands |
| Tailwind 4 OK if tokens map to CSS variables first | Tokens before utility soup |
| Cloudflare Pages / Workers | Already in ecosystem |

Do not rewrite to Next “because portfolio.” Svelte stays.

---

## Domain-agnostic config

```ts
// site.ts shape
{
  url: "https://8tp.dev", // swap later when domain purchased (hunterm.dev UNAVAILABLE)
  title: "Hunter M.",
  tagline: "…",
  email: "hunter@…", // placeholder until domain locked
  author: { name: "Hunter M.", handle: "8tp", … },
  socials: [{ label: "GitHub", url: "https://github.com/8tp" }],
}
```

UI chrome should say **Hunter M.** more than **8tp.dev**.

---

## Screenshot tests (ship only if pass)

From anti-slop playbook:

- [ ] Remove any logo — page still feels specific?  
- [ ] Custom / product-relevant visuals > 0?  
- [ ] Grayscale hierarchy still works?  
- [ ] Typefaces nameable (not “Inter and something”)?  
- [ ] One primary action above the fold?  
- [ ] `prefers-reduced-motion` respected?  
- [ ] Mobile density intentional, not broken?  
- [ ] Would this look like 10 other AI portfolios? If yes, rewrite.  

---

## Assets to produce in build

| Asset | Spec |
|-------|------|
| Favicon SVG | Monogram H or simple ink mark on transparent/paper |
| favicon.ico / png 32, 16 | From SVG |
| apple-touch-icon 180 | Solid paper + mark |
| OG image 1200×630 | Name + short thesis + paper texture; no clutter |
| twitter:image | Same OG |
| Avatar | From profile pipeline (optional in v1) |
| Project images | Reuse/refine existing `/public/projects/*` or quieter crops |
