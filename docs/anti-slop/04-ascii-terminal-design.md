# ASCII, Terminal & Monospace Web Design

*Three overlapping tracks on X (2025–26): editorial monospace systems, ASCII-as-texture for landings, terminal as product identity for builder tools.*

---

## Why this matters for anti-slop

ASCII / mono is a **constraint system**. Models aren’t over-optimized for it the way they are for purple SaaS cards — so composed terminal design still reads as intentional.

Wes Winder–style take circulating: ASCII art is a taste benchmark — easy to generate, hard to make *composed*.

---

## Flagship projects

| Project | Link | Why it lands |
|---------|------|--------------|
| **The Monospace Web** | [owickstrom.github.io/the-monospace-web](https://owickstrom.github.io/the-monospace-web/) · [GitHub](https://github.com/owickstrom/the-monospace-web) | All-monospace CSS: character grid, responsive tables in `ch` steps, box-drawing diagrams, semantic HTML. Cited as “purest aesthetic” (Design in Tech). |
| **Polar vision** | [polar.sh](https://polar.sh) | Product marketing as TUI: mono throughout, terminal motion |
| **ASCII Magic** | [ascii-magic.com](https://www.ascii-magic.com/) | Image/video → multi-style ASCII (Braille, pixel, mosaic…) + bloom, chromatic aberration |
| **US Graphics / Berkeley Mono** | [usgraphics.com](https://usgraphics.com) | Engineering-graphics density; industrial catalog taste (ULINE/McMaster DNA) |
| **glyphcss** | [glyphcss.com](https://glyphcss.com/) | 3D GLB → live ASCII |
| **ascii.today** | [ascii.today](https://ascii.today/) | Figlet-style titles, character-grid fonts |
| **Framer ASCII Engine** | [asciiengine.framer.ai](https://asciiengine.framer.ai/) | Live image/video → ASCII component |
| **terminal-browser.com** | site | Real browsing in terminal chrome |

### Industrial cousins (same tribe)

- ULINE / McMaster-Carr density — high information, low decoration  
- terminal.shop lineage / OpenCode TUI polish  

---

## Techniques

### A. Pure text / DOM monospace

```css
:root {
  --cell: 1ch;
  --lh: 1.25;
  font-family: "Berkeley Mono", "JetBrains Mono", ui-monospace, monospace;
  line-height: var(--lh);
}
/* width systems in ch; responsive in character steps */
.panel { width: 72ch; max-width: 100%; }
```

- Box-drawing Unicode: `┌─┐│└┘╠╣` in `<pre>` / figures  
- Semantic HTML restyled (Monospace Web approach)  
- New CSS: **`text-fit`** for responsive ASCII blocks ([css-tip.com/ascii-art](https://css-tip.com/ascii-art/))  

### B. Canvas / WebGL

- Luminance → character ramp (` .,:;+*#@`, Braille)  
- Video frames → ASCII 15–60 fps  
- Three.js bloom ASCII, GLSL, p5.asciify  
- WebSocket “fake video” as text (autoplay-safe)  

### C. Pre-rendered production

```
Image/video → ASCII Magic / Framer Engine
  → Figma compose (luxury type + sparse UI)
  → Framer / Next ship
```

### D. Real TUI craft feeding web taste

- Python: Rich / Textual  
- Go: Bubbletea + Lipgloss  
- Rust: Ratatui  
- Node: Ink  

Skills people share: box styles, phosphor palettes, Braille spinners, sparklines — **not** default green-on-black only.

---

## Libraries & tools

| Tool | Role |
|------|------|
| figlet / figlet.js | Banner fonts CLI + browser |
| [ascii-art](https://github.com/khrome/ascii-art) | Node/browser: images, tables, ANSI |
| glyphcss | 3D → ASCII |
| p5.asciify | Creative-coding ASCII |
| xterm.js | Embed real terminal |
| cool-ascii-faces | Novelty faces (low design signal now) |
| lucasmarkes/motes | Pointer-reactive procedural ASCII BGs |
| ASCIIToSVG | Diagrams → SVG |
| REXPaint | Offline ASCII map/UI mockups |

### Fonts designers ship with

| Font | Vibe |
|------|------|
| **Berkeley Mono** | Engineering premium (frequent poll winner) |
| **Departure Mono** | Distinctive; [departure-mono.rt.ht](https://departure-mono.rt.ht/) |
| JetBrains Mono | Dev default, solid |
| iA Mono / Duo / Quattro | Readable mono family |
| IBM Plex Mono | Technical + free |

---

## Design rules: good vs gimmicky

### Done well

1. **Constraint is the system**, not a sticker ASCII logo on a SaaS template  
2. **Hierarchy** — bold/dim/reverse, panels, dividers (not equal-weight walls of text)  
3. **Motion with purpose** — boot typewriter, cascade reveal, live ASCII from *product* imagery  
4. **Density with breathing room** — Polar / Monospace Web balance  
5. **One mono family** committed  
6. **Escape hatches** — `prefers-reduced-motion`; optional skin toggle  
7. **Color beyond Matrix** — amber CRT, soft cyan, brand hue + mono  

### Gimmicky

| Anti-pattern | Why it fails |
|--------------|--------------|
| Full-page green rain + unreadable body | Nostalgia costume |
| Fixed-width ASCII heroes that break mobile | Looks broken |
| Terminal portfolio with no content | Skin without product |
| ASCII on pricing, legal, everything | Noise |
| Heavy CRT overlay killing contrast | Style > legibility |

---

## Pairing with modern product design

| Fit | Examples |
|-----|----------|
| Devtools, agents, builder billing | Polar vision; agent CLIs |
| Developer portfolios | Terminal SPA, boot-sequence chat |
| Hero moments only | Luxury landing + ASCII texture BG |
| Creative tools | Image→ASCII *is* the product |
| Dense data monitoring | Terminal metaphor |

### Patterns that work

1. **Marketing = terminal; app = modern UI**  
2. **ASCII as texture, product as clarity**  
3. **Agent-native** — text UIs legible to agents *and* humans  
4. **Brutalist adjacency** — hard edges + mono grid (related but not identical)  

### When *not* to use

Consumer wellness, non-technical enterprise sales, multi-step onboarding for non-devs.

---

## Accounts to follow

| Handle | Why |
|--------|-----|
| @owickstrom | The Monospace Web |
| @emilwidlund / @polar_sh | Terminal product marketing |
| @usgraphics | Engineering graphics, Berkeley Mono |
| @kail_designs | ASCII portfolio motion / Magic |
| @uihssn / @uixhassan | ASCII background packs |
| @basit_designs | Luxury + ASCII landings |
| @iamdavidhill | terminal.shop → OpenCode |
| @ChallengesCss | Responsive CSS ASCII techniques |

---

## Agent prompt snippet (terminal product site)

```
Aesthetic: neon-terminal / engineering mono
- One monospace font only (Berkeley Mono or JetBrains Mono)
- Dark background, one acid accent (not purple) — e.g. #7CFF6B or amber #FFB000
- Box-drawing panel chrome for feature sections
- Hero: real CLI output or product logs, not abstract Matrix rain
- Body narrative can use a clean sans for long reading; UI chrome stays mono
- Ban: glassmorphism, gradient orbs, Inter, soft card shadows
- Motion: boot sequence once; respect prefers-reduced-motion
```

---

## Bottom line

| Track | Durability |
|-------|------------|
| Editorial monospace systems | High craft, lasting |
| ASCII motion/texture landings | High shareability, trend-burn risk |
| Terminal as builder-tool identity | Strongest product fit |

**Done well:** grid discipline, one accent, hierarchy, real content.  
**Gimmicky:** Matrix wallpaper on generic SaaS.
