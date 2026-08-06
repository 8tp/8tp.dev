# Opus 5 — Full redesign orchestration prompt

Copy everything below the line into Opus (Claude) as the primary task prompt. Work in this repo root: the cloned `8tp/8tp.dev` portfolio.

---

## PROMPT START

You are the lead engineer + design implementer for a full redesign of my personal portfolio.

### Repo & docs (read first, in order)

1. `docs/README.md`
2. `docs/redesign/00-brief.md`
3. `docs/redesign/05-design-system.md` ← **design source of truth**
4. `docs/redesign/01-portfolio-strategy.md`
5. `docs/redesign/02-github-feature-tiers.md`
6. `docs/anti-slop/06-anti-slop-playbook.md` + skim `docs/anti-slop/00-index.md`
7. Current code: `src/`, `package.json`, `astro.config.mjs`, `src/data/*`, `public/`

Also pull design DNA from my startpage (paper/ink tokens, dither, motion restraint):

- https://github.com/8tp/startpage (css/style.css, index.html, README)

Aesthetic north star: **Dead Simple Sites** (https://deadsimplesites.com/) — uncluttered, professional, no scroll-jacking, no AI-slop SaaS patterns.

### Who I am / what this site is

- Name: **Hunter M.** · GitHub **@8tp** · currently https://8tp.dev  
- I ship: realtime multiplayer browser games, self-hosted tools, native macOS utilities, commercial web (Shopify).  
- I work as a software engineer in the military; **do not** put military details, unit, clearance, or job history on this site. Keep personal/freelance/OSS only. LinkedIn stays separate.  
- I may switch domains later (name-forward). **`hunterm.dev` is NOT available** — do not hardcode it. Candidates: `byhunter.dev`, `madebyhunter.com`, `workwithhunter.com`, `hunterm.sh` (see `docs/redesign/03-domains-and-email.md`). Until purchased, keep `https://8tp.dev` in config. **Do not over-brand “8tp”.** Prefer “Hunter M.” as the human face; @8tp only as GitHub handle in footer/socials.  
- Contact email may change; use configurable `site.email` (placeholder OK, e.g. current hunter@8tp.dev).  
- **Do not feature Still / Android still-\* projects** — I’m not actively owning that line.  
- Stack: **keep Svelte** (Astro + Svelte 5 islands is fine; SvelteKit only if you justify it). Do not rewrite to Next/React for the portfolio shell.

### Design thesis (non-negotiable)

**Paper & ink · Swiss calm portfolio** — warm paper background, near-black ink, optional quiet dither backdrop, light display type, narrow reading measure, soft control cards, restrained motion.

**Not:** neon terminal magazine (old site energy), purple gradient SaaS, glassmorphism grid, neo-brutal loud, gamer HUD, heavy 8tp cyber branding.

Follow `docs/redesign/05-design-system.md` tokens and ban list. Run anti-slop screenshot tests before calling done.

### Information architecture (build this)

```
Hero — Hunter M. · one-line thesis · CTAs (Work, Contact, GitHub) · optional avatar
Spotlights (2–3) — Instagib Arena, Palhelm, optional third (Coup or Vitals)
Client work — Aeperion.com case study (before/after slots if assets missing, leave structured placeholders)
Selected work (4–6) — Coup, TypeDuel, ScreenCap, Vitals?, Palhelm Bot (subordinate), HudAim optional
Utilities (compact) — netmap, tidewatcher, LiteStats, Recopy, …
Also — AntMaze, wc26-bracket, startpage
Contact — clear email (+ optional form that doesn’t require backend if skippable)
Footer — name · @8tp · year · domain from config
```

**Rule:** fewer cards, deeper hierarchy. 3 strong stories > 12 equal repo tiles.

### Project feature set (authoritative)

**Spotlights / must:**

- Instagib Arena — https://instagib.win — https://github.com/8tp/instagib-arena  
- Palhelm — https://palhelm.com — https://github.com/8tp/palhelm  
- Coup — elevate — https://coup.8tp.dev — https://github.com/8tp/Coup  

**Client (not GitHub card):**

- Aeperion — full Shopify storefront redesign — https://aeperion.com  
  Structure as case study: role, live link, before/after image slots, 3–5 process/outcome bullets. No fake metrics.

**Featured / secondary:** TypeDuel (duel.8tp.dev), ScreenCap (macOS flagship), Palhelm Bot, Vitals (vitals.8tp.dev) if you keep product-shaped presentation, HudAim optional.

**Utilities compact:** netmap, tidewatcher, LiteStats, Recopy (and ghgarden only if space).

**Also:** AntMaze, wc26-bracket, startpage.

**Skip featuring:** Still*, forks, DevDock, thin toys, DTAK. Link “all repos” to github.com/8tp.

Use/extend `src/data/projects.ts` (and add `clients.ts` if cleaner). Mark tiers explicitly.

### Interactive / realtime

I have realtime multiplayer skill (Instagib, Coup, TypeDuel). **Do not** clone viral multiplayer basketball portfolio gimmicks.

v1 preference:

- Excellent Play/Visit CTAs on realtime projects  
- Optional later: quiet presence — **not required for first ship**  
- If you add any multiplayer micro-interaction, it must stay dead-simple quiet and progressive-enhanced  

Motion budget: staggered entrance + one hover language. Honor `prefers-reduced-motion`.

### Hover previews (required enhancement)

Implement **restrained desktop hover previews** for visual projects (inspired by omarabdulrahim.com side hacks via Dead Simple Sites) — full spec in `docs/redesign/05-design-system.md` → “Hover preview spec”.

**Must:**

- Opt-in per project via data (`preview` image path); spotlights, featured games/apps, Aeperion case  
- **Skip** utilities, bots, text-only rows  
- Desktop hover/focus: fade in fixed-size real product still (WebP); soft paper-consistent chrome  
- Lazy-load preview on first hover or intersection  
- Mobile: no hover theater (optional static thumb only)  
- `prefers-reduced-motion`: no animated reveal  
- Prefer card-local reveal over cursor-following chase for v1  
- Never replace primary Play/Visit CTA  

**Must not:** preview every row, autoplay loud video walls, scroll-jack.

### Technical requirements

- Astro 6 + Svelte 5 + existing Tailwind 4 **or** clean CSS variables first (tokens in CSS; Tailwind maps to them — tokens win)  
- Fully responsive, accessible (contrast, focus, semantic HTML, alt text)  
- SEO: title, description, canonical, Open Graph, Twitter cards  
- `sitemap` via existing `@astrojs/sitemap` if still appropriate  
- Theme: light default + dark (system + toggle), paper/ink both modes  
- Performance: minimal JS; islands only where needed; optimize images (sharp already in package)  
- Domain-agnostic config in `src/data/site.ts` (`url`, `title`, `email`, `author`, `socials`)  
- Keep pnpm; `pnpm install && pnpm build` must pass  
- Do not commit secrets  

### Assets you must create (OG, favicon, everything)

Generate or craft and place under `public/`:

| Asset | Spec |
|-------|------|
| `favicon.svg` | Simple monogram **H** or quiet geometric mark; ink on transparent/paper — **not** a face photo |
| `favicon.ico` | Derived |
| PNG favicons 32×32, 16×16 (and 192/512 if useful) | Derived from SVG |
| `apple-touch-icon.png` 180×180 | Paper field + mark |
| `og.png` or `og.jpg` **1200×630** | Name “Hunter M.” + short thesis; paper texture / quiet dither; no clutter; works in light identity |
| Wire Layout head: `og:image`, `twitter:card` summary_large_image, theme-color matching paper/ink |
| Optional avatar placeholder path if no photo yet | Document expected path e.g. `public/avatar.jpg` |

You may generate assets with code (SVG, canvas, Satori/resvg, sharp pipeline, or a small node script). Prefer **owned** graphics over external CDNs.

Project thumbnails: reuse `public/projects/*` where good; regenerate quieter paper-consistent thumbs only if old ones fight the new system.

### Copy guidelines

- Specific, calm, first-person or neutral professional — no “build the future,” no hype  
- Hero thesis example direction: games, self-hosted tools, native apps, and commercial web  
- Project blurbs: one tight paragraph or 1–2 sentences; engineering truth over feature laundry lists  
- Aeperion: commercial case language (redesign, Shopify, brand storefront)  

### Implementation plan (orchestrate in this order)

1. **Read** docs + current src; inventory components to replace vs delete  
2. **Design tokens** — implement paper/ink CSS variables (startpage-aligned); global styles; kill old terminal/magazine look  
3. **Site config** — domain-agnostic `site.ts`; update meta/Layout  
4. **Assets** — favicon set + OG image + head tags  
5. **Data model** — re-tier projects; add client case data  
6. **Layout shell** — narrow measure, theme toggle, footer  
7. **Sections** — Hero → Spotlights → Client → Featured → Utilities → Also → Contact  
8. **Components** — Svelte/Astro as appropriate; ProjectCard redesigned; ClientCase component  
9. **Hover previews** — selective desktop preview per design-system spec; wire `preview` fields for visual projects  
10. **Responsive + a11y pass**  
11. **Anti-slop review** — screenshot tests from playbook; fix slop if any  
12. **`pnpm build`** green; fix errors  
13. **Short `docs/redesign/CHANGELOG-REDESIGN.md`** — what changed and how to swap domain/email later  

### Out of scope (do not do unless trivial)

- Buying domains or setting DNS/email  
- Military LinkedIn merge  
- Building Still apps  
- Full multiplayer presence backend  
- Rewriting product games themselves  

### Definition of done

- [ ] New visual system live in dev/build; old magazine/terminal UI gone  
- [ ] Hierarchy matches IA above; Aeperion case study present  
- [ ] Selective hover previews on visual projects only (not utilities)  
- [ ] Favicons + OG + meta complete and referenced  
- [ ] Config makes domain/email rename a one-file change (not hunterm.dev)  
- [ ] No Still; no heavy 8tp branding  
- [ ] `pnpm build` succeeds  
- [ ] Anti-slop tests pass (you explicitly check them in the changelog)  
- [ ] README or redesign changelog tells me how to run and what to replace for avatar/email/domain  

### Working style

- Prefer editing/replacing existing structure over leaving dead `_legacy` as the product  
- Delete unused old components once replaced  
- Keep commits logical if you commit; otherwise leave a clean working tree  
- When uncertain on content facts, prefer existing project descriptions in `src/data/projects.ts` and live URLs  

Start by reading the docs listed above, then implement end-to-end.

## PROMPT END
