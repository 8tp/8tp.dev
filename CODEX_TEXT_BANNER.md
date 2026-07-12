# Codex prompt — chuds.dev banner + card cleanup

This file is two related jobs:

1. **Generate** an aesthetic text-only banner at `public/banner.webp`.
2. **Regenerate** four project thumbnails that came back with text overlaps,
   garbled glyphs, or off-palette art. Other thumbnails stay as-is.

Hand the entire file to codex. Use OpenAI's image API (`gpt-image-1`, or
`gpt-image-2` if available — the surface is identical).

---

## Hard rules that apply to every image below

- **Palette:** Tokyo Night, copied from `~/.config/kitty/kitty.conf`. No
  warm browns, no tans, no orange-dominant backgrounds. Allowed background
  is `#1a1b26` (base) or `#16161e` (deeper). Panels: `#1f2335`. Borders:
  `#3b4261`. Text: `#c6d0f5` / `#a9b1d6` / `#737aa2` / `#565f89`.
- **No text overlaps.** Every label, button, and pill must sit on its own
  rectangle of background. If two elements would collide, move one — don't
  layer them.
- **Real readable English.** No garbled glyphs, no question marks where
  letters should be, no "tex̸t̷" smearing, no half-rendered words. If the
  model can't render a label cleanly, leave it out entirely rather than
  shipping corrupted typography.
- **Flat modern UI.** Crisp 1px borders, soft shadows, generous padding,
  rounded corners 8–12 px. No glow halos, no synthwave neon, no
  glassmorphism overload.
- **Output sizing:** generate at 1024×1024, then center-crop + resize to
  the target with `magick`. WebP, quality 85, method 6.

---

# Job 1 — text banner → `public/banner.webp` (1280×320)

> The site renders an HTML wordmark by default; this image is optional polish.
> If it's missing the page falls back to plain text, so the only reason to
> ship this is if the result is unambiguously better than the HTML version.

```
A wide horizontal banner, 4:1 aspect ratio (1280×320). Pure typography
art — no UI chrome, no traffic lights, no decorative scenes, no humans.

Background: solid #1a1b26 (Tokyo Night base) with a single very faint
diagonal grain texture, almost imperceptible.

Centered, occupying ~60% of the canvas width: the wordmark "chuds.dev"
rendered as a custom display-monospace style. The "chuds" portion is in
#c6d0f5 off-white with a slight inner highlight on the top edge of each
letter (as if lit from above). The "." is a 12px filled square in
#9ece6a green, set inline with the text — like a unix prompt cursor
that decided to live mid-word. The ".dev" portion is in #bb9af7 magenta
with a 1px inner shadow giving it a slight pressed-in look.

The font feel: chunky geometric monospace, thick weight (around 800),
generous letter-spacing (around 0.04em), all lowercase. Think of a hand-
crafted ligature-rich coding font like Berkeley Mono or PragmataPro
displayed at marquee size — confident, not cute.

Below the wordmark, in a smaller weight-400 monospace with the same
letter-spacing, a single line:
  $ games, self-hosted tools, and native apps
"$" in #9ece6a green. The rest in #737aa2 muted lavender.

Optional: in the bottom-right corner, a tiny 8px dotted line drawing
of a half-moon and a few stars in #565f89 — a subtle nod to "tokyo
night" without spelling it out.

Absolutely no photorealism, no glow halos, no synthwave neon, no
gradient skies. The whole banner reads as flat, deliberate, terminal-
adjacent typography. Sharp, legible, no anti-aliasing artifacts on text.
```

Crop: 1024×1024 → center-crop to 1024×256 → resize to 1280×320.

---

# Job 2 — regenerate four broken thumbnails

The other six thumbnails (`hudaim`, `typeduel`, `netmap`, `litestats`,
`screencap`, `recopy`) look fine — leave them alone.

For each project below, regenerate the asset, overwriting the existing
`public/projects/<slug>.webp`. **Read `src/data/projects.ts` first to
confirm the slug list and accent colors haven't changed.**

Crop for all four: 1024×1024 → center-crop to 1024×640 → resize to
**512×320** (16:10).

### `coup.webp` — accent: green `#9ece6a` (regenerate)

The original came back with the "alex claims Tax" pill overlapping the
"CHALLENGE" button, and the card art used a gold/yellow diamond instead
of the project's green accent. Fix:

```
Top-down view of a multiplayer card-game UI in Tokyo Night palette.
Background #1a1b26. Three flat illustrated cards (back-of-card design
only, no characters) fanned in the center, the card backs decorated
with a subtle green #9ece6a circular medallion pattern on a dark navy
inner panel. Above the cards, a clean horizontal status row with two
player chips: a magenta dot + "alex · 2 coins" on the left, a blue dot
+ "morgan · 5 coins" on the right. Below the cards, a single full-
width footer pill with a green dot + "you · 7 coins". To the right
of the cards, a single rounded rectangular green button labeled
"CHALLENGE" — the button must NOT be overlapped by anything else.
DO NOT include a separate "alex claims Tax" pill anywhere; just the
players, the cards, and the one CHALLENGE button. Top-left: white
sans-serif title "COUP". Top-right: small mono "Turn 4 · Deck 9".
Flat modern UI, no card-table felt texture, no realism. 16:10.
```

### `ghgarden.webp` — accent: mint `#73daca` (regenerate)

The original's contributions header rendered as `Cont. ?ut?o?s @8tp?` —
gibberish where "Contributions" should be. Day labels were partially
hidden behind the heatmap. Fix:

```
Terminal TUI screenshot of a GitHub contribution visualizer in Tokyo
Night palette, mint #73daca accent. Window title bar reads
"ghgarden — 120x40" centered. Below the title bar, on its own row:
left-aligned "ghgarden  @8tp" in mint, right-aligned "[2026]" in
mint, with a horizontal rule beneath.

The main content is a contribution heatmap. Heading directly above
the heatmap, on its OWN line with a clear blank row beneath it before
the squares start: "Contributions" in mint. Do not write any other
words on this line. The heatmap below: a 7-row by ~52-column grid
of small rounded squares in five shades of mint from dark base
#1a1b26 through #1f3b3a, #2c5e58, #4a9c91, to bright #73daca. To the
LEFT of the grid (in their own gutter column with proper spacing,
not behind the squares), three day labels stacked: "Mon", "Wed",
"Fri" — each in muted #737aa2 monospace, vertically aligned with
their row.

Below the heatmap, a 2-column row of stat panels:
  Left panel "Stats":   "Current streak  47 days" / "Total contributions  1,842"
  Right panel "Top Languages":  three small mint progress bars labeled
                                 "Rust 41%", "TypeScript 28%", "Go 18%".
All panels have rounded #3b4261 borders on a #1f2335 fill. Pure
JetBrains Mono typography. Every word must be a real, fully-rendered
English word — no half-letters, no question marks where letters
should be. 16:10.
```

### `antmaze.webp` — accent: yellow `#e0af68` (regenerate)

The original came back with a brown/tan game board on a darker brown
background — entire image is warm-toned, off-palette. Fix:

```
A minimal browser-game UI screenshot in Tokyo Night palette. The
ENTIRE background is solid #1a1b26 dark navy. Absolutely no brown,
no tan, no orange-dominant tones anywhere except the yellow accent.

Centered: an 11x11 maze drawn with thin 2px warm-yellow #e0af68 lines
on the same dark navy panel #1f2335 (rounded corners, 1px #3b4261
border). A single small filled yellow circle (the ant) sits inside
the maze with a faint 3-cell yellow trail behind it showing where
it came from. A green #9ece6a target square sits in the bottom-right
corner cell.

Top of the canvas: a horizontal HUD row with three chips, evenly
spaced — "Level 5" (left, white sans), "0:47.2" (center, yellow
mono), "Score 1840" (right, white sans). Bottom of canvas: a single
small yellow text label "CLEAN RUN" centered.

No characters, no illustrations, no warm wood textures, no parchment
backgrounds. Flat modern game UI on Tokyo Night dark navy. 16:10.
```

### `tidewatcher.webp` — accent: orange `#ff9e64` (regenerate)

The original came back warm-brown with garbled tail characters
("WindowServer ~~~__~~..") in the process list. Fix:

```
Terminal TUI screenshot of a system monitor in Tokyo Night palette.
The ENTIRE background is solid #1a1b26 dark navy. No browns, no tans,
no warm wood-tone backgrounds anywhere. The only orange in the image
is the accent color #ff9e64 used for the line charts and a few labels.

Top status row in monospace #737aa2: "Tidewatcher  theme Lantern Ember
refresh 2s  proc 148". A single 1px orange divider beneath it.

Below, a 2x2 grid of rounded panels, each with a #3b4261 border on
#1f2335 fill:

  TOP-LEFT  "CPU"     "System CPU Avg"     "18.4%"
            A tide-shaped orange #ff9e64 sparkline beneath, drawn as a
            smooth line not bars. Tiny label row "cores 8% 21% 12% 34%"
            in muted gray.
  TOP-RIGHT "Memory"  "RAM In Use"          "34%"
            A different orange sparkline. Label "Avail 10.5G  Free 3.8G".
  BOT-LEFT  "Disk"    "/ 43%  0 B/s"
            A horizontal orange progress bar at 43%. Label
            "/Volumes/data 61%".
  BOT-RIGHT "Network" "en0 down 42 KB/s"
            A small orange sparkline. Label "up 8 KB/s  local 192.168.1.42".

Below the grid, a wide processes panel "Processes [cpu | per-core]"
showing a header row "PID  Core%  RSS  I/O  Name" and 3 rows of clean
monospace data:
   1042  1.2  31M  0B/s  tidewatcher
    332  0.7  84M  0B/s  WindowServer
    412  0.4  57M  0B/s  Finder
DO NOT add stray ascii waves, tildes, or trailing dots after the
process names. Each row is just the five clean columns above.

Pure JetBrains Mono typography. Every word fully rendered, no
half-letters, no garbled glyphs. 16:10.
```

---

## Implementation snippet

```python
from openai import OpenAI
import base64, pathlib, subprocess

client = OpenAI()

def gen(out_relpath: str, prompt: str, target_w: int, target_h: int):
    resp = client.images.generate(
        model="gpt-image-1",          # or gpt-image-2 if available
        prompt=prompt,
        size="1024x1024",
        quality="high",
        n=1,
    )
    png = pathlib.Path(f"/tmp/{pathlib.Path(out_relpath).stem}.png")
    png.write_bytes(base64.b64decode(resp.data[0].b64_json))

    crop_h = int(1024 * target_h / target_w)
    out = pathlib.Path(out_relpath)
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call([
        "magick", str(png),
        "-gravity", "center",
        "-crop", f"1024x{crop_h}+0+0", "+repage",
        "-resize", f"{target_w}x{target_h}",
        "-quality", "85",
        "-define", "webp:method=6",
        str(out),
    ])

# Job 1 — banner
gen("public/banner.webp", BANNER_PROMPT, 1280, 320)

# Job 2 — four broken thumbnails (slugs map to the prompts above)
for slug, prompt in {
    "coup": COUP_PROMPT,
    "ghgarden": GHGARDEN_PROMPT,
    "antmaze": ANTMAZE_PROMPT,
    "tidewatcher": TIDEWATCHER_PROMPT,
}.items():
    gen(f"public/projects/{slug}.webp", prompt, 512, 320)
```

## After it lands

1. Run `pnpm build` and visually check each regenerated card. If anything
   still has overlapping text or off-palette art, regenerate that single
   card up to 3 more times before falling back to the original.
2. If you decide to ship the banner image, edit `src/components/Banner.astro`
   — replace the `<h1>` block with `<img src="/banner.webp" alt="chuds.dev"
   class="block w-full h-auto rounded-xl border border-border" />` and drop
   the `<p>` tagline (the image carries it).
3. Commit on the current branch (`astro-redesign`) titled
   `Regenerate broken card thumbnails + add text banner`.

## Sanity rules

- If a regenerated image has unreadable text, regenerate that one project
  (max 3 retries). Do **not** ship gibberish typography — keep the
  previous version if you can't get a clean render.
- Estimated cost: 5 images × `gpt-image-1 high` ≈ $0.25–$0.45 total.
