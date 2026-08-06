# design.md — Project Design System

> Fill this before generating any UI. Agents must treat this as source of truth.

## Product

- **Name:**
- **One-line truth:** (what it does for whom, no buzzwords)
- **Primary CTA:**
- **Audience:** (engineers / founders / consumers / …)

## Aesthetic thesis (pick ONE)

- [ ] Grainwave cinematic SaaS (Hewar mode)
- [ ] Neon terminal / engineering mono
- [ ] Swiss calm / typographic
- [ ] Neo-brutal indie
- [ ] Dark cinematic product
- [ ] Editorial magazine
- [ ] Other: _______________

**In one sentence, the site should feel like:**

>

## Typography

| Role | Family | Weight | Notes |
|------|--------|--------|-------|
| Display / logo | | | NOT Inter |
| Body | | | |
| Mono / chrome | | | optional |

**Type rules:**

- Max heading size strategy:
- Body size / line-height:
- Letter-spacing:

## Color (max 5)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | | |
| `--fg` | | |
| `--muted` | | |
| `--accent` | | |
| `--danger` or extra | | |

**Rules:** flat colors first · gradients only if listed here · no default indigo `#6366F1`

## Shape language

- **Radius scale:** e.g. `0 / 4 / 8` only — avoid 16px everywhere
- **Borders:** e.g. `1px solid var(--fg)` or `3px solid #000`
- **shadows:** hard offset / soft / none — pick one language

## Spacing

- Base unit: `4` or `8` px
- Section vertical rhythm:
- Content max-width:

## Motion budget (max 2 signature moments)

1.
2.

- Default easing:
- Respect `prefers-reduced-motion`: yes

## Imagery

- **Style lock:** (Grainwave / product screenshots only / ASCII texture / …)
- **Tools:** Midjourney / Flux / Recraft / photo
- **Banned imagery:** purple blobs, neural orbs, generic 3D glass shapes, stock “team smiling at laptop” unless real

## Icons

- Family: Phosphor / Lucide / custom Recraft SVG only
- Weight:
- Never mix icon families

## Component library policy

- Headless base: none / Base UI / shadcn (rethemed) / Oat
- Expressive add-on (pick at most one): Magic UI / Aceternity / React Bits / Canvas UI / Neobrutal / WebTUI / none
- Rule: libraries implement this file; this file is not rewritten to match library defaults

## Positive references

1. URL / note:
2. URL / note:

## Negative references (ban list)

- Purple-blue gradients as brand personality
- Glassmorphism stack on cards
- Inter / Roboto / Arial as primary type
- Floating Live/New badges without meaning
- Abstract AI blob heroes
- Equal 3-column Lucide feature grid as only content
- Soft 16px radius + drop shadow on every surface
- CTA: “Build the future” / “Unlock potential” / “Seamless”
- (add project-specific bans)

## Copy voice

- Tone:
- Words we use:
- Words we never use:

## Definition of done

- [ ] Looks on-brand without logo
- [ ] ≥1 custom product-relevant visual
- [ ] Passes grayscale hierarchy glance
- [ ] One clear primary action
- [ ] Mobile intentional, not broken
- [ ] Reduced-motion safe
