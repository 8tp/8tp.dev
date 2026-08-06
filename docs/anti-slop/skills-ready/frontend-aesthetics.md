# Frontend Aesthetics Block (paste into agent instructions)

Use this block in project instructions, CLAUDE.md, AGENTS.md, or a skill. Replace bracketed fields from `design.md`.

---

## Visual direction

You are implementing a **[AESTHETIC THESIS]** interface for **[PRODUCT]**.

This is not a generic SaaS template. Optimize for **taste, hierarchy, and brand-specific imagery** over default “AI pretty.”

## Typography (required)

- Display: **[DISPLAY FONT]**
- Body: **[BODY FONT]**
- Mono (if any): **[MONO FONT]**
- **Never use** Inter, Roboto, Arial, or system-ui as the primary brand type without explicit approval.

## Color

Use only these tokens:

```css
:root {
  --bg: [HEX];
  --fg: [HEX];
  --muted: [HEX];
  --accent: [HEX];
  --surface: [HEX];
}
```

No purple/indigo gradient personalities. No default Tailwind indigo CTAs.

## Shape & depth

- Radius: **[SCALE]**
- Shadow language: **[hard offset | soft single | none]**
- Borders: **[spec]**

## Layout

- Strong hierarchy: one primary action above the fold
- Prefer intentional whitespace over card soup
- Bento only if the content architecture needs unequal tiles — not as decoration
- Mobile: reflow intentionally; do not leave fixed desktop art broken

## Imagery

- Prefer: custom brand art series, real product UI screenshots, diagrams
- Avoid: abstract blobs, neural orbs, glass 3D primitives, stock “AI brain”
- Optional texture: subtle film grain overlay (opacity ~0.04)

## Motion

Allowed signature moments (max 2):

1. **[MOMENT 1]**
2. **[MOMENT 2]**

Everything else: subtle or static. Honor `prefers-reduced-motion: reduce`.

## Components

- Implement from design tokens first
- If using shadcn/Base UI: retheme completely — do not leave zinc/slate defaults
- At most one marketing motion library section
- Prefer semantic HTML patterns where possible

## Absolute bans

- Purple-blue gradients as the brand
- Glassmorphism on every card
- Floating “Live” / “New” badges without product meaning
- “Build the future” / “Unlock potential” / “Seamless experience” copy
- Equal three-column icon feature rows as the only feature design
- Soft 16px radius + drop shadow on every surface
- Emoji as primary visual system

## Quality bar

Before finishing, answer:

1. If we remove the logo, does this still feel like a specific brand?
2. How many custom product-relevant visuals are there? (0 = fail)
3. Does hierarchy work in grayscale?
4. Would a senior designer call this intentional or generated?

If any answer fails, revise — do not ship.
