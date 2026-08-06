# Master brief — portfolio redesign

**Owner:** Hunter M. · GitHub [@8tp](https://github.com/8tp)  
**Current domain:** 8tp.dev (expect eventual domain change — do **not** over-brand “8tp”)  
**Stack preference:** Keep **Svelte** (Astro + Svelte islands or SvelteKit).  
**Aesthetic north star:** [Dead Simple Sites](https://deadsimplesites.com/) + personal [startpage](https://github.com/8tp/startpage) paper-and-ink system.

---

## One-line thesis

> Solo engineer who ships **playable realtime systems**, **self-hosted operator tools**, and **native utilities** — and **commercial storefront craft** when brands need the same bar.

**Not:** gamer mascot site · terminal magazine · heavy “8tp” brand · military resume · Still/Android inventory.

---

## Audiences (in order)

1. **Freelance / commercial clients** — Shopify, marketing sites, product UI (Aeperion is the proof)
2. **Technical peers / hiring** — realtime multiplayer, self-hosted products, native craft
3. **Casual visitors** — clean enough that the work speaks; no noise

Military SE role stays **off this site** for now (LinkedIn). Optional soft line later: software engineer, USA — no unit/program detail.

---

## What the current site does well / poorly

| Keep spirit of | Drop or demote |
|----------------|----------------|
| Real shipped products with live links | Equal weight on 12+ repo cards |
| Honest technical descriptions | Terminal/magazine conceit density |
| Live play CTAs for games | Heavy “8tp” chrome as brand |
| Native macOS utilities as craft | Still ecosystem (not actively owned) |
| | Skill % bars, purple SaaS patterns, Inter-default |

---

## Information architecture (target)

```
[quiet paper backdrop — optional dither, startpage-like]

Hero
  Name (Hunter M.) · one-line thesis · primary CTAs (Work · Contact · GitHub)

Spotlights (2–3 max)
  Instagib Arena · Palhelm · (optional: Coup or Vitals)

Client work
  Aeperion.com case study (before/after if available) — distinct layout, not a repo card

Selected work (4–6 cards)
  Coup · TypeDuel · ScreenCap · Vitals (if standing behind it) · HudAim optional · Palhelm Bot as child

Utilities (compact row / list)
  netmap · tidewatcher · LiteStats · Recopy · (ghgarden optional)

Also / playful (small)
  AntMaze · wc26-bracket · startpage

Contact
  Clear email + optional form · no mailto-only dead end

Footer
  Name · GitHub @8tp · domain (placeholder OK) · year
```

**Rule:** 3 strong case studies > 10 project cards.

---

## Content pillars (feature)

| Tier | Projects |
|------|----------|
| **S** | Instagib Arena, Palhelm, Coup (elevate), Vitals (add if still product-shaped), **Aeperion (client)** |
| **A** | TypeDuel, ScreenCap (macOS flagship), Palhelm Bot (subordinate) |
| **B** | AntMaze, wc26-bracket, netmap, tidewatcher, startpage |
| **C / skip** | Still*, forks, DevDock, thin toys, DTAK |

Full table: [02-github-feature-tiers.md](./02-github-feature-tiers.md)

---

## Branding posture

- **Light name-forward identity:** “Hunter M.” not “8tp Studios”
- GitHub handle **@8tp** can remain in footer/social
- Domain TBD (`hunterm.dev` unavailable; try `byhunter.dev` / `madebyhunter.com`) — use **config/site constants**, not hard-coded 8tp everywhere
- No logo mascot required; typography *is* the brand
- Products keep their own domains (instagib.win, palhelm.com, aeperion.com)

---

## Interactive / realtime (optional, restrained)

Do **not** copy viral basketball portfolios. Exemplify realtime skill without making the site an arcade:

- Optional: live presence count + quiet shared micro-interaction, **or**
- Primary: clear Play links to Coup / Instagib / TypeDuel
- Motion budget: staggered entrance + one signature hover language (startpage school)
- Must respect `prefers-reduced-motion`

---

## Deliverables for redesign build

- [ ] Full visual redesign (Dead Simple + paper/ink)
- [ ] Responsive + accessible
- [ ] Favicon set (svg + apple + png sizes)
- [ ] OG image (1200×630) + Twitter card meta
- [ ] Sitemap, robots, meta description
- [ ] Project data model cleaned to tiers above
- [ ] Client case section for Aeperion
- [ ] Contact path (email primary; form optional)
- [ ] Anti-slop review pass
- [ ] Domain-agnostic `site` config (easy rename)

---

## Related

- Design tokens: [05-design-system.md](./05-design-system.md)
- Domains: [03-domains-and-email.md](./03-domains-and-email.md)
- Profile photo: [04-profile-image.md](./04-profile-image.md)
- Anti-slop: [../anti-slop/06-anti-slop-playbook.md](../anti-slop/06-anti-slop-playbook.md)
- Build prompt: [OPUS-PROMPT.md](./OPUS-PROMPT.md)
