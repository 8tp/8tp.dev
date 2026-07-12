# Codex prompt — generate chuds.dev assets with `gpt-image-1`

Hand this entire file to **codex** (or any agent with shell + OpenAI image-gen
access). The agent will call OpenAI's image API to generate **one banner** plus
**ten project thumbnails**, save them in `public/`, and verify the build.

> Model id is `gpt-image-1` as of this writing — swap to `gpt-image-2` if it's
> available when you run this; the API surface is identical.

---

## Goal

Generate cohesive Tokyo-Night-themed artwork for chuds.dev:

1. **`public/banner.webp`** — a 1280×320 hero banner that reads "chuds.dev" with
   the tagline "games, self-hosted tools, and native apps". Used at the
   very top of the page in `src/components/Banner.astro`.
2. **`public/projects/<slug>.webp`** — one 512×320 thumbnail per project,
   keyed by the slug in `src/data/projects.ts`. Used by the Svelte
   `ProjectCard` in the `Projects` grid.

The whole set must feel like **screenshots from one rig** — same lighting,
same palette, same level of UI polish. Imagine that every image is a kitty
window from Hunter's tiled desktop.

---

## Hard constraints (apply to every image)

### Palette — Tokyo Night, copied verbatim from `~/.config/kitty/kitty.conf`

```
bg          #1a1b26   (page background, terminal canvas)
bg-dark     #16161e   (deepest backdrop, title bars)
panel       #1f2335   (raised panels, cards)
elev        #292e42   (rows, hovers)
border      #3b4261   (1px window edges)
fg          #c0caf5   (primary text)
fg-dim      #a9b1d6   (secondary text)
fg-muted    #737aa2   (labels, helpers)
comment     #565f89   (annotations, the muted-most text)

red         #f7768e   (errors, accents)
orange      #ff9e64
yellow      #e0af68
green       #9ece6a
mint        #73daca
cyan        #7dcfff
blue        #7aa2f7
magenta     #bb9af7   (brand — yabai's insert-feedback color)
purple      #9d7cd8
```

- Pick **exactly one** accent per image and use it for the project's primary
  color. The accent **must match** the `accent` field in
  `src/data/projects.ts` — read that file first, do not re-pick.
- Backgrounds: `#1a1b26` (page) on top of `#16161e` (deepest). Panels `#1f2335`.
  Avoid pitch black (`#000`) and avoid bluish slate (`#2a3041`-ish).
- Borders: `#3b4261` 1px, never thicker.
- Subtle gradients allowed, but no glassmorphism, no glossy gradients, no neon
  outer-glow halos. Tokyo Night is matte, not synthwave.

### Style

- Flat modern UI. Crisp 1px borders. Soft shadows. Generous padding. Rounded
  corners (8–12 px). Think Linear / Raycast / Arc / Ghostty, not Material.
- **Typography inside the image:** monospace (JetBrains Mono / Fira Code feel)
  for code, terminal, paths, and HUDs. Sans (Inter / SF Pro feel) for body
  text. Real, legible English — never lorem ipsum, never garbled glyphs.
- **No human faces**, no fake brand logos (GitHub octocat ok), no AI signatures,
  no pixelation artifacts, no blurry text.
- Where the project's wordmark or app icon makes sense, include it.

### Output sizing

- Generate at **1024×1024**, then crop + resize to the target with `sharp` or
  `magick`. WebP, quality 85, mozjpeg-style mode 6.
- Banner target: **1280×320** (4:1 aspect).
- Thumbnail target: **512×320** (16:10 aspect).

---

## The banner — `public/banner.webp` (1280×320)

```
A wide horizontal banner image, 4:1 aspect ratio, Tokyo Night theme.
Background is the terminal navy #1a1b26 with very subtle radial glows in
magenta #bb9af7 (top-left) and cyan #7dcfff (bottom-right), kept very low
opacity so the canvas reads as nearly flat.

Centered: a giant wordmark "chuds.dev" rendered in a chunky geometric
monospace, weight 700-900, letter-spacing slightly tight. The "chuds" part
is in #c0caf5 off-white; ".dev" is in magenta #bb9af7. Optional: a thin
1px magenta cursor block blinking after ".dev".

Below the wordmark, a smaller monospace tagline in #a9b1d6:
    "$ games, self-hosted tools, and native apps"
The "$" prompt symbol is in green #9ece6a.

In the very bottom-left corner, three traffic-light dots (red #f7768e,
yellow #e0af68, green #9ece6a) the size of pencil erasers — a hint that
the whole thing is a kitty terminal window. In the top-right corner, a
faint "tokyonight" tag in #565f89 monospace.

Absolutely no human faces, no decorative scenes, no characters, no
glow halos, no synthwave neon. Flat, modern, terminal aesthetic.
4:1 horizontal banner. Sharp legible text — rasterize this prompt as
clean vector-flat typography.
```

After generation, **center-crop the 1024×1024 to 1024×256, then resize to
1280×320** with high-quality lanczos. Encode webp quality 85.

---

## Per-project thumbnails — `public/projects/<slug>.webp` (512×320 each)

Each prompt below reuses the palette + style constraints above. Each image
should look like it could be a real screenshot from the application.

### `antmaze.webp` — accent: yellow `#e0af68`
```
A minimal browser game UI screenshot in Tokyo Night colors. Centered:
a small grid maze (around 11x11 cells) drawn with thin warm-yellow lines
(#e0af68) on a dark navy background (#1a1b26). A glowing yellow ant token
sits on one cell, with a faint yellow trail behind it. Top-left HUD chip
labeled "AntMaze" in #c0caf5 sans-serif. Top-right shows "LV 5  ·  15x15".
Bottom shows three small stat pills: "SCORE 1840", "STREAK 1.5x", "0:47".
Flat modern game UI, no illustrations, no characters. 16:10.
```

### `hudaim.webp` — accent: cyan `#7dcfff`
```
First-person aim trainer UI in Tokyo Night palette. Dark navy backdrop
(#1a1b26) with a 3D-style flat-shaded arena hinted at the center. Three
glowing cyan (#7dcfff) circular targets float in the foreground. Crosshair
in the exact center. Bottom HUD bar shows: "ACCURACY 87%", "TTK 412ms",
"STREAK 14". Top-left wordmark "HudAim" in #c0caf5 sans. No weapons, no
characters, no realistic 3D. Flat low-poly aesthetic, soft glow on
targets only. 16:10.
```

### `coup.webp` — accent: green `#9ece6a`
```
Top-down view of a multiplayer card game UI in Tokyo Night. Three flat
illustrated cards fanned in the foreground (back-of-card design only,
soft green #9ece6a medallion pattern, no characters). A round green
"CHALLENGE" button glows on the right. Top of screen shows player chips
"alex · 2 coins" and "you · 7 coins" with small avatar circles. Title
"COUP" top-left in #c0caf5 mono. Dark navy background (#1a1b26). No
table felt texture, no realism. Clean modern board-game-app look. 16:10.
```

### `typeduel.webp` — accent: red `#f7768e`
```
Split-screen multiplayer typing UI in Tokyo Night. Left half shows a
paragraph of monospace text with the first ~40 characters highlighted
red (#f7768e) as if typed; a cursor block sits on the next character.
Right half shows opponent's progress bar at ~60% with a matching red
fill. Top center: "TypeDuel" wordmark + a heart-meter HUD ("YOU 84 HP
/ THEM 32 HP"). No avatars, no faces. Sharp monospace text, dark navy
backdrop (#1a1b26). 16:10.
```

### `tidewatcher.webp` — accent: orange `#ff9e64`
```
A terminal TUI screenshot of a system monitor in Tokyo Night palette.
Pure dark navy terminal (#1a1b26) with a thin orange (#ff9e64) accent
stripe along the top edge (the focused yabai window). Inside: a CPU
usage line chart that looks like an ocean tide wave (orange line on
dark bg), a process table below ("PID  CMD  CPU%  MEM"), and a small
ASCII art scene of waves at the bottom right. Window title bar reads
"tidewatcher". JetBrains Mono typography. No external chrome, no
desktop wallpaper. 16:10.
```

### `ghgarden.webp` — accent: mint `#73daca`
```
Terminal TUI showing a GitHub contribution heatmap in Tokyo Night,
mint (#73daca) palette. The heatmap fills the top half — a 7x52 grid
of squares in five shades of mint from dark (#1a1b26) to bright
(#73daca). Below the heatmap: "Streak: 47 days" and a small horizontal
language-breakdown bar (Rust 41%, TypeScript 28%, Go 18%, etc.) using
subtle accent colors. Window title "ghgarden". Monospace text only.
Dark navy terminal background. 16:10.
```

### `netmap.webp` — accent: blue `#7aa2f7`
```
Terminal TUI of a network topology map in Tokyo Night. A node graph
rendered with box-drawing characters and ASCII lines connects six
labeled nodes ("router", "nas", "macbook", "phone", "printer", "pi")
with latency values on each edge ("12ms", "3ms", etc.). Blue (#7aa2f7)
accent for node borders. Bottom status bar: "6 hosts · 23 ports ·
2.4ms avg". Title "netmap". Monospace, dark navy (#1a1b26) background,
no extra chrome. 16:10.
```

### `litestats.webp` — accent: magenta `#bb9af7`
```
A macOS menu-bar app dropdown panel in Tokyo Night. Render only the
dropdown — a rounded floating panel ~300px wide on a dark navy
(#1a1b26) background. Inside: four rows showing "CPU 24%", "RAM
8.4 / 16 GB", "DISK 412 / 1024 GB", "BATT 87%", each with a tiny
magenta (#bb9af7) bar graph. A small magenta gauge at the top reads
"62°C". SF Pro typography. Top-right: a tiny "•" menu bar icon hint.
No window chrome, no desktop. 16:10.
```

### `screencap.webp` — accent: purple `#9d7cd8`
```
A macOS screen-capture toolbar overlay in Tokyo Night. Centered: a
floating dark capsule with rounded corners showing icons in a row —
rectangle-select, window-select, fullscreen, record, color-picker,
OCR (text icon), GIF — all in purple (#9d7cd8) outline. A faint dashed
purple selection rectangle is drawn over a softly-blurred abstract
desktop in the background. Wordmark "ScreenCap" tiny at the
bottom-right. No real desktop content, no human faces. 16:10.
```

### `recopy.webp` — accent: yellow `#e0af68`
```
A macOS clipboard manager dropdown panel in Tokyo Night. Floating
rounded panel ~340px wide, dark navy bg (#1a1b26). Inside: a list of
five clipboard history rows, each with a tiny icon (text, link, image,
code, color swatch), a label ("commit hash a3f9c2…", "https://chuds.dev",
"Screenshot.png", etc.), and a yellow (#e0af68) timestamp ("2m", "1h",
"yesterday"). Top of panel: search field and a small yellow "Recopy"
title. SF Pro typography. No window chrome. 16:10.
```

---

## Implementation steps for the agent

1. **Read** `src/data/projects.ts` and grab the `slug` + `accent` for each
   project. If a slug here doesn't match the prompts in this file, **stop**
   and ask the user — don't guess.
2. For each prompt in this file, call OpenAI's image API:
   ```python
   from openai import OpenAI
   import base64, pathlib, subprocess

   client = OpenAI()

   def gen(slug: str, prompt: str, target_w: int, target_h: int):
       resp = client.images.generate(
           model="gpt-image-1",   # use gpt-image-2 if available
           prompt=prompt,
           size="1024x1024",
           quality="high",
           n=1,
       )
       png_path = pathlib.Path(f"/tmp/{slug}.png")
       png_path.write_bytes(base64.b64decode(resp.data[0].b64_json))

       # Center-crop to target aspect, then resize, then encode webp.
       crop_h = int(1024 * target_h / target_w)
       out = pathlib.Path(f"public/{slug}.webp" if slug == "banner"
                          else f"public/projects/{slug}.webp")
       out.parent.mkdir(parents=True, exist_ok=True)
       subprocess.check_call([
           "magick", str(png_path),
           "-gravity", "center",
           "-crop", f"1024x{crop_h}+0+0", "+repage",
           "-resize", f"{target_w}x{target_h}",
           "-quality", "85",
           "-define", "webp:method=6",
           str(out),
       ])

   gen("banner",      BANNER_PROMPT,      1280, 320)
   for slug, prompt in PROJECT_PROMPTS.items():
       gen(slug, prompt, 512, 320)
   ```
   If `magick` isn't on the path, fall back to `ffmpeg` or `sharp` —
   anything that produces correctly-sized webp at quality 85.
3. **Verify:** run `pnpm build` and confirm there are no broken-image
   warnings. The diagonal-stripe placeholder in `ProjectCard.svelte`
   should disappear once the thumbnails land. The banner fallback (CSS
   wordmark) should be replaced by the real `/banner.webp`.
4. **Commit** the new images on the current branch (`astro-redesign`) in
   one commit titled `Add generated banner + project thumbnails`. Don't
   commit the intermediate PNGs.

## Sanity rules

- If a generated image has unreadable text, regenerate that one image
  (max 3 retries). Do **not** ship gibberish typography.
- If the API returns a content-policy refusal, soften the language
  (e.g. "duel" → "match", "weapon" → "tool") and retry once.
- Estimated cost: ~11 images × `gpt-image-1 high` ≈ $0.50–$0.90 total.
  Confirm with the user before regenerating in bulk if the first batch
  is unsatisfactory.
