# Asset Tools & Workflows (Anti-Slop)

*Practical map for builders using AI coding agents. Through-line: foundation → system → style-locked assets → code — not prompt → tweak → ship.*

---

## Tool matrix

| Tool | Category | Strength | When to use |
|------|----------|----------|-------------|
| **Midjourney V7/V8** | Image | Cinematic style, moodboards, `--sref` locks; V8 favored for graphic brand series | Heroes, brand illustration language — *not* production SVG icons |
| **Flux / Flux.2** | Image | Prompt adherence, realism | Photoreal product/lifestyle; retexture in MJ for art direction |
| **Ideogram** | Image | Best text-in-image | Posters, ads, packaging with legible words |
| **Recraft (Vector)** | Image/brand | Native SVG, brand style training | Icon systems, logo exploration, consistent vectors |
| **SDXL / ComfyUI + LoRA** | Image | Full control, brand LoRAs | High-volume on-brand once trained |
| **Phosphor** | Icons | Weights + duotone; less generic than Lucide | Product UI differentiation |
| **Lucide** | Icons | Coverage, React-first | App chrome (customize or swap family) |
| **Iconify / Tabler / Hugeicons** | Icons | Breadth | Multi-set pipelines |
| **Spline** | 3D | Browser 3D, easy embed | Interactive heroes without Three.js team |
| **Three.js / R3F** | 3D | Full control, perf | Serious product scenes |
| **Theatre.js** | 3D motion | Timeline on Three | Cinematic scroll reveals |
| **Rive** | Motion | State machines | Feature demos, reactive marks |
| **Lottie** | Motion | Lightweight loops | Empty states, onboarding |
| **Framer Motion** | Motion | React UI motion | Product marketing + app |
| **GSAP + ScrollTrigger** | Motion | Scroll orchestration | Award-level landings |
| **CSS-only** | Motion | Zero deps | Load staggers, hovers |
| **Geist / Satoshi / Instrument / Mona** | Type (sans) | Inter alternatives | Product + marketing |
| **Instrument Serif / Fraunces / Newsreader** | Type (display) | Editorial contrast | Agency / luxury |
| **JetBrains / Berkeley / IBM Plex Mono** | Type (mono) | Dev identity | Devtool marketing |
| **Indie foundries** | Type | Unique personality | When Google Fonts still feels common |
| **SVG feTurbulence grain** | Texture | Zero-image film grain | Depth without stock PNGs |
| **WebGL / shaders** | BG | Atmosphere | Devtool/cyber; gate for motion prefs |
| **figlet / ascii-magic** | ASCII | Terminal signal | Devtool heroes, section dividers |
| **Figma + Paper** | Design | Composition | System + layout (Hewar stack) |
| **Tokens Studio** | Figma | Design tokens | Clean handoff to code |
| **Stitch / Figma MCP / Relume** | AI design | Structure extraction | Starts only — never ship raw |
| **Kling AI** | Video | Product / background motion | Short cinematic loops |
| **Photoshop / Illustrator** | Finish | Human fingerprint | Grain, half-tone, vector cleanup |

---

## Workflow A — Branded SaaS landing (Hewar-adjacent)

```
1. Foundation (30–60 min)
   - Product truth, audience, primary CTA
   - 5–10 real reference sites (not AI defaults)
   - design.md: palette, type, radius, motion, bans

2. Visual system
   - Type: Instrument Serif + Geist  OR  custom serif + restrained sans
   - MJ series with --sref / personalization (12 images, one style name)
   - Icons: Phosphor OR Recraft Vector set (never mix styles)

3. Hero asset
   - Full-bleed custom art OR real product UI in chrome frame
   - Post-process: film grain + half-tone (PS)
   - Optional: one Rive/Spline moment only

4. Build
   - Feed design.md + refs + anti-refs to agent (max thinking)
   - Next.js or Framer; ship one section first, then expand

5. Polish
   - SVG noise overlay
   - One load stagger
   - Design review: hierarchy, spacing, a11y, reduced-motion
```

---

## Workflow B — Developer tool marketing site

```
1. Aesthetic lock: "neon terminal" OR "Swiss + mono"
2. Assets:
   - figlet / real asciinema for hero
   - Real terminal recordings > abstract AI art
   - Thin Phosphor or custom line icons
3. Motion: CSS cursor/typewriter sparingly; GSAP for architecture diagrams
4. 3D: usually skip; if needed, low-poly schematic not glossy blobs
5. Content first: install one-liner, latency numbers, specific claims
6. Agent bans: gradients-as-personality, Inter, purple, soft cards
```

---

## Workflow C — Portfolio / agency

```
1. Personality over system scale
2. One strong display face (foundry or Syne / Bricolage / Playfair)
3. Case-study photography + process shots > stock
4. Custom illustration language OR pure type + brutalist layout
5. Motion as craft: Figma → Rive for mark + project hovers
6. Unusual grid (asymmetric), one memorable interactive
7. Ship process publicly (tools + constraints)
```

---

## Prompt patterns: distinctive vs slop

### Image gen

| Goal | Pattern | Avoid |
|------|---------|--------|
| Style lock | Subject + medium + lighting + **print/era ref** + `--sref` | “modern minimalist UI soft gradients glassmorphism” |
| Brand set | Same hex list + “flat vector, consistent stroke, no glow” | Mixing photoreal + 3D + flat |
| Text | Ideogram with exact headline in quotes | MJ for critical wordmarks |
| Hybrid | Flux structure → MJ retexture | Single-model one-shot |
| Human texture | “film grain, slight asymmetry, print misregistration” | “8k ultra detailed award winning” |

### Brand bento board (for systems)

Generate a grid with: logo, merch, poster, color chips, type specimen, UI chrome — so agents see a **system**, not one hero.

### UI agents

```
frontend_aesthetics:
  - distinctive type pairing (named fonts)
  - committed ≤5 color palette (hex)
  - high-impact motion moments (list max 2)
  - atmospheric background approach
  BAN: Inter, purple-blue gradients, blob heroes,
       glassmorphism stack, "Build the future",
       equal 16px radius cards, floating Live badges
```

---

## Typography pairings that aren’t Inter + something

| Pairing | Vibe |
|---------|------|
| Instrument Serif + Instrument Sans | Modern editorial product |
| Fraunces + Source Sans 3 | Warm display + clean body (use carefully — AI default risk) |
| Newsreader + DM Sans | Magazine SaaS |
| Playfair Display + Source Serif 4 | Luxury editorial |
| Syne + Manrope | Agency bold |
| JetBrains Mono + IBM Plex Sans | Devtools |
| Archivo Black + Space Grotesk | Neo-brutal |
| Berkeley Mono + pure mono layout | Terminal systems |

**Inter substitutes often recommended:** Geist, Satoshi, Switzer, Mona Sans, Public Sans, Figtree.

---

## Texture drop-in (grain overlay)

```css
.noise::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Use with Hewar-style full-bleed art or dark cinematic heroes.

---

## Motion pick chart

| Need | Pick |
|------|------|
| Interactive product state | Rive |
| Simple marketing loops | Lottie |
| React UI transitions | Framer Motion |
| Scroll storytelling | GSAP |
| Lightweight / a11y-first | CSS + IntersectionObserver |

---

## Figma / AI design tools — respect hierarchy

| Respect | Use carefully | Slop pipeline |
|---------|---------------|---------------|
| Tokens Studio, Iconify, LottieFiles | Relume (IA), Stitch (design.md extract), Figma MCP → Claude | Pure “generate whole site” plugins shipped raw |
| Site → Figma reverse engineering for study | UX Pilot starts | Default purple shadcn dumps |

**Rule:** AI for structure and extraction; humans (or strict design.md) for type, color, imagery, copy.

---

## Accounts with process breakdowns

| Account | Why |
|---------|-----|
| @hewarsaber | Custom MJ series, stack, craft philosophy |
| @Ror_Fly (Rory Flynn) | MJ/Weave, moodboards, retexture, collage systems |
| @marcelkargul | Figma → Rive → Lottie production motion |
| @jp (Joey Primiani) | AI-first landing + design review; “taste is the moat” |
| @itsolelehmann | Positive/negative refs, Stitch design.md |
| @elayadesigns | Agent landing design skills |
| @Dari_Designs | Brand systems from MJ → bento boards |
| @promptsref | MJ `--sref` library |
| @aliszu | Inspo library roundups |
| @greensock | GSAP/WebGL craft |
| @splinetool | Browser 3D patterns |

### Inspo indexes

- [Landing.love](https://www.landing.love/)  
- [Saaspo](https://saaspo.com/)  
- [Supahero](https://supahero.io/)  
- [BentoGrids](https://bentogrids.com/)  
- [CTA.gallery](https://www.cta.gallery/)  
- [Appmotion](https://appmotion.design/)  
- [Footer.design](https://www.footer.design/)  

---

## Bottom line for coding agents

1. **Never leave taste to the model** — design.md + refs + bans  
2. **Specialize models:** Recraft/Phosphor for chrome; MJ/Flux for campaign art; Ideogram for type-in-image; Rive/GSAP/CSS for motion  
3. **Ship real product truth** (screens, numbers, founder voice)  
4. **One distinctive system, applied ruthlessly** beats more plugins  
