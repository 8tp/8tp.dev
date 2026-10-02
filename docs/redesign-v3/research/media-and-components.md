# Video, project pages, component libraries

These notes cover only what's new since `docs/anti-slop/03-component-libraries.md` and
`05-asset-tools-workflows.md`. Versions were checked 2026-10-02.

## Video hosting: R2 at `media.8tp.dev` (or `media.hunterm.dev`)

| Option | Cost here | Verdict |
|---|---|---|
| **R2 + custom domain** | ~$0. Egress is free; 10 GB and 10M Class B reads/month are free. | **Use this.** First-party, content-hashed, immutable. |
| Cloudflare Stream | $5/mo per 1k stored min + $1 per 1k delivered | Only if trailers grow past about 3 min or you need adaptive bitrate |
| Mux | Free tier capped at 10 assets | No |
| YouTube / Vimeo | Free | Post the game trailers there for discoverability, but play the self-hosted file on the site |

- Don't use `evidence.8tp.dev` for the live site. It's a shared agent token, has no `.vtt`
  support, and its 206 Range support (which Safari requires) is unconfirmed.
- Don't commit video to git (GitHub's 100 MB cap, and history bloat). Posters stay in the repo.
- Check Range support with `curl -sI -H 'Range: bytes=0-1' <url>`, which should return 206.

## Players

- **Loops**: bare `<video muted loop playsinline preload="none" poster=…>`. No library.
- **Trailer**: native `<video controls>` inside `<dialog>` on the list, inline on project pages.
  - Safari lacks `closedby="any"`, so add a backdrop-click handler.
  - On close, `pause()` and remove `src` so the download stops.
- **Upgrade path**: Video.js 10 `@videojs/html`, which went GA 2026-10-01. These are custom
  elements, so they work in `.astro`.
- **Avoid**:
  - Vidstack (security-only maintenance, migrating to Video.js 10)
  - Plyr (being deprecated)
  - media-chrome (merging into Video.js 10)
  - Playwright `recordVideo` (hardcoded 1 Mbit VP8, blurry text)

## Patterns

- In-view autoplay with IntersectionObserver at threshold 0.5. Never autoplay under
  `prefers-reduced-motion` or `navigator.connection.saveData`. `play().catch()` because iOS
  Low Power Mode rejects it, and the poster stays.
- **Visible pause control** on any autoplaying loop over 5 s (WCAG 2.2.2). Hover-started
  previews don't need one.
- Hover peek in `EntryList.svelte`: add an optional `video` to `Preview` and render it inside
  `{#key}` with `poster={still.src}`. Touch never hydrates the island, so touch devices never
  download clips.
- Use `<source media="(max-width: 40rem)">` to give phones a 720p trailer.
- Captions: `<track kind="captions">` when there's speech; otherwise a one-line text description.

## Encoding

```sh
# Grade matches build-assets' sharp grade
GRADE="hue=s=0.62,lutrgb=r='23+val*223/255':g='24+val*222/255':b='22+val*221/255'"

# 8 s loop, H.264 fallback (~0.4–1.5 MB)
ffmpeg -ss 12 -t 8 -i take.mov -vf "scale=1280:-2:flags=lanczos,fps=30,$GRADE" -an \
  -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart loop.h264.mp4
# Same in AV1 (~40–50% smaller)
ffmpeg -ss 12 -t 8 -i take.mov -vf "scale=1280:-2:flags=lanczos,fps=30,$GRADE" -an \
  -c:v libsvtav1 -preset 5 -crf 38 -g 240 -pix_fmt yuv420p -movflags +faststart loop.av1.mp4

# Trailer with sound (147 MB → roughly 10–25 MB)
ffmpeg -i trailer.mp4 -vf scale=1920:-2:flags=lanczos -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart trailer.1080.h264.mp4
ffmpeg -i trailer.mp4 -vf scale=1920:-2:flags=lanczos -c:v libsvtav1 -preset 4 -crf 32 -g 240 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart trailer.1080.av1.mp4

# Poster = loop's first frame, so still and clip never drift
ffmpeg -ss 12 -i take.mov -frames:v 1 -update 1 assets-src/stills/<slug>.png
```

Skip VP9. Pick loop ranges where the end looks like the start, or `xfade` the last 0.5 s.
Codec strings: `av01.0.05M.08` / `avc1.640028` (loops), `av01.0.08M.08` (1080p).

## Pipeline

- **DOM apps**: extend `capture-stills.mjs` with CDP `Page.startScreencast`.
  - `withPage` needs to dispatch `method` events as well as `id` replies.
  - Write the frames out, then build an ffconcat from the timestamp deltas.
  - Choppy for WebGL under SwiftShader.
- **Games**: record by hand on the GPU, either
  `ffmpeg -f avfoundation -framerate 60 -capture_cursor 0 -i "<screen>:none" -t 30 -c:v h264_videotoolbox -b:v 40M`
  or OBS.
- **New `scripts/build-clips.mjs`** driven by a `CLIPS` manifest (src, in, dur, crop). It:
  1. encodes both codecs with the grade,
  2. extracts the poster frame into `assets-src/stills/`,
  3. names outputs by content hash,
  4. writes `src/data/media.ts`.

  It skips quietly if ffmpeg is missing. `pnpm media:push` uploads new hashes with
  `wrangler r2 object put … --cache-control "public, max-age=31536000, immutable"`.

## Project pages (Astro 6)

- `src/content.config.ts`: a `work` collection with the `glob` loader over `src/content/work/*.mdx`.
  Import `z` from `astro/zod`; the entry id equals the `projects.ts` slug.
- Use MDX (`@astrojs/mdx`) so `<Clip>`, `<Figure>` and `<Trailer>` can sit inline.
- `src/pages/work/[slug].astro` → `CaseStudy.astro` wrapping `Layout.astro`.
  - `Layout` gets an `ogImage` prop.
  - Throw at build time if an MDX file has no matching project.
- Per-page OG image: `src/pages/work/[slug]/og.png.ts`, built with sharp.
  - Move the `ogSvg` template out of `build-assets.mjs` into `src/lib/og.ts`.
- **Native cross-document View Transitions**: `@view-transition { navigation: auto; }` under
  `prefers-reduced-motion: no-preference`.
  - Shared `view-transition-name` on the list title and the page `<h1>`.
  - The peek image can morph into the page hero.
  - Skip `<ClientRouter>`.
  - Firefox just navigates normally.
- Internal links lose `target="_blank"`.

## Component libraries

**Use**:
- Platform features first: `<dialog>`, `popover`, scroll-snap, `@view-transition`,
  scroll-driven animations, `@starting-style`.
  - References: [scroll-driven-animations.style](https://scroll-driven-animations.style),
    [smolcss.dev](https://smolcss.dev).
- [Bits UI](https://bits-ui.com) (MIT, Svelte 5, headless), only if a real widget is needed.
  Or melt; not both.
- [Open Props](https://open-props.style) easing curves (copy the values; don't install).
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) as the review checklist.
- `svelte/motion` covers the peek easing already.

**Avoid**:
- shadcn-svelte, Skeleton 5, Svelte Bits (MIT + Commons Clause), Aceternity ports:
  they need Tailwind (the repo has none) and are where the generic look comes from.
- Web Awesome 3: too heavy for a site with almost no widgets.
- Number Flow, carousels: pricing-page clichés.
