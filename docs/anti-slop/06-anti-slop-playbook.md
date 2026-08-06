# Anti-Slop Playbook

*The synthesis: how to use AI to ship sites that don’t look like everyone else’s AI sites.*

---

## The diagnosis

AI default ≈ statistical median of training data:

- Purple / indigo gradients  
- Inter + soft cards  
- Glass + glow  
- Abstract blobs  
- Zero custom product-specific visuals  
- Vague “build the future” copy  

Detectable in seconds. Hewar’s test: *count custom visuals — slop has 0, craft has 15.*

---

## The process (do this every time)

```
foundation → system → positive refs → negative refs → assets → build → review → ship
```

Not:

```
prompt → tweak → tweak → tweak → ship
```

### Step-by-step

1. **Foundation**  
   Product one-liner, audience, primary CTA, competitive visual context  

2. **System**  
   Fill `skills-ready/design.md` — aesthetic name, fonts, ≤5 colors, radius, shadow, motion budget  

3. **Positive references**  
   2–3 real sites or screenshots you love (or extract design.md via Stitch / hand notes)  

4. **Negative references**  
   Screenshot a slop landing; ban every pattern in it  

5. **Assets first**  
   MJ/Flux series with style lock; Recraft icons; optional ASCII/grain; real product screens  

6. **Build with high reasoning**  
   Design is where default thinking = default slop  

7. **Design review pass**  
   Hierarchy, spacing, contrast, reduced-motion, “screenshot test: could this be 10 other startups?”  

8. **Human finish**  
   Grain, half-tone, one interactive hero moment, copy that only *you* would write  

---

## Six anti-slop rules

| # | Rule |
|---|------|
| 1 | **One visual thesis** — Grainwave cinematic · neon terminal · Swiss calm · neo-brutal · editorial mono — pick one |
| 2 | **Custom imagery or none** — no generic AI blobs; either product truth or owned art language |
| 3 | **Ban Inter + purple gradients** unless you have a *reason* |
| 4 | **Tokens before components** — libraries implement your system, not the other way around |
| 5 | **Motion budget = 2** — more is wallpaper |
| 6 | **Finish by hand** — texture, type kerning, crop, copy |

---

## Positive / negative reference pattern (agent)

```
POSITIVE:
- Match density, type contrast, and hero treatment of: [URL or screenshot]
- Our brand system: [paste design.md]

NEGATIVE (never do these):
- Purple-blue gradients on white or black
- Glassmorphism on every card
- Inter / Roboto / Arial as primary type
- Floating "Live" / "New" badges without purpose
- Abstract orb / blob / neural-network stock art
- Equal 3-column feature cards with icons from Lucide defaults
- Soft 16px radius + drop shadow on every surface
- CTA copy: "Build the future", "Unlock potential", "Seamless experience"
```

(See high-engagement writeup from @itsolelehmann on positive + negative refs + Stitch design.md extraction.)

---

## Aesthetic decision tree

```
Who is the audience?
├── Engineers / builders
│   → Neon terminal OR Swiss mono OR Linear-like calm dark
│   → Libraries: Oat / WebTUI / SRCL / themed shadcn
│   → Assets: real CLI, diagrams, ASCII texture optional
│
├── B2B SaaS founders (premium / enterprise)
│   → Hewar Grainwave OR dark cinematic OR editorial calm
│   → Custom MJ series + sparse UI chrome
│   → Libraries: headless only; few marketing blocks
│
├── Indie / playful consumer
│   → Neo-brutal OR soft clay moments OR bold editorial
│   → Libraries: Neobrutal UI + custom illo
│
└── Agency / portfolio / culture
    → Swiss editorial OR maximal structured OR pure type
    → Motion as craft (Rive/GSAP)
```

---

## Screenshot tests (ship only if pass)

- [ ] Remove the logo — does the page still feel like a specific brand?  
- [ ] Count custom visuals — is it > 0 and product-relevant?  
- [ ] Would this still look OK in grayscale? (hierarchy test)  
- [ ] Can you name the typefaces without looking? (if “Inter and something,” rewrite)  
- [ ] Is there one clear primary action above the fold?  
- [ ] Does motion respect `prefers-reduced-motion`?  
- [ ] Mobile: does anything look “broken constraint” rather than “designed density”?  

---

## Skill ideas for Grok / Claude Code

You asked for design skills. High-leverage skills to build next:

| Skill | Job |
|-------|-----|
| `anti-slop-landing` | Enforces design.md + ban list + section structure |
| `grainwave-hero` | Hewar-style hero composition + MJ prompt pack |
| `terminal-marketing` | Mono grid, box-drawing sections, CLI content patterns |
| `design-review` | Hierarchy / spacing / a11y / slop pattern scanner |
| `token-scaffold` | Generate CSS variables + Tailwind theme from design.md |
| `asset-pipeline` | Checklist: MJ series → Recraft icons → grain → export sizes |

Drop-in starters live in `skills-ready/`.

---

## Copy that fights slop

| Slop | Craft |
|------|-------|
| Build the future of X | [Specific outcome in user’s words] |
| Seamless AI-powered platform | [What it replaces] in [time] |
| Unlock your potential | Ship [artifact] without [pain] |
| Trusted by industry leaders | Named logos + one metric |

Write product truth first; design amplifies it.

---

## Stack recipes (copy-paste starting points)

### Recipe 1 — Konvert / Grainwave SaaS

```
Next.js + Tailwind
Headless: Base UI or minimal shadcn (rethemed)
Art: Midjourney series + PS grain/half-tone
Type: editorial serif logo + clean sans body
Motion: Framer Motion on CTA only; optional Kling loop
Hosting: Vercel
```

### Recipe 2 — Semantic trust tool

```
Plain HTML or Astro
Oat CSS (+ oat-animate sparingly)
Custom type, almost no JS chrome
Real screenshots, no 3D
```

### Recipe 3 — Devtool terminal

```
Next.js
The Monospace Web tokens OR WebTUI/SRCL
Berkeley Mono / JetBrains Mono
figlet headers + asciinema embeds
One accent color (not purple)
```

### Recipe 4 — Bold indie

```
Next.js + Tailwind
neobrutalism-components OR Neobrutal UI
Custom illustration (not default yellow kit only)
Hard shadows, thick borders, loud type
```

---

## Related open resources

- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills)  
- Oat: [oat.ink](https://oat.ink)  
- The Monospace Web: [GitHub](https://github.com/owickstrom/the-monospace-web)  
- Impeccable / slop gallery discourse (@pbakaus)  
- Hewar free MJ pack: Figma Community midjourney imagery  

---

## Closing

Hewar’s entire positioning collapses to one usable sentence for agents and humans:

> **Taste is the moat. Custom visuals are the unfair advantage. Details are everything.**

Use this pack so your AI-built sites start from that sentence — not from the model’s default purple card grid.
