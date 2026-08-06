# Profile image recommendations

**Goal:** Client-safe, professional, still *you* — not a 1:1 selfie dump, not uncanny AI influencer.

---

## What makes sense for this portfolio

| Context | Best form |
|---------|-----------|
| Dead Simple / paper-ink site | **Restrained portrait** — muted palette, simple bg, strong crop |
| Freelance clients | Trust = real human, good light, no costume, no neon cyberpunk |
| GitHub + site consistency | Same crop family (square + optional circle mask) |
| OG / social | Can be more graphic; still match paper/ink |

**Avoid for client work:**

- Full anime / cartoon avatar as *only* face  
- Heavy Midjourney “beautiful stranger” drift (doesn’t look like you)  
- Sunglasses / mask / extreme stylization that hides identity  
- Gamer headset cyberpunk default  
- Stock “CEO on laptop” energy  

**Good middle ground:** photographic base → tasteful AI restyle that keeps **face structure, hair, age range, expression** locked.

---

## Recommended approach (selfie → Midjourney)

### 1. Shoot a strong source selfie first

| Do | Don’t |
|----|--------|
| Soft daylight (window), face evenly lit | Harsh overhead yellow light |
| Neutral expression or slight closed-mouth smile | Duck face, extreme angles |
| Plain wall / simple bg | Busy room, vertical blinds chaos |
| Camera at eye level, 1–2m if possible | Ultra-wide chin distortion |
| Sharp eyes, high res | Heavy filters, beauty apps first |
| Shoulders up / head-and-shoulders | Full body unless you crop later |

Shoot **5–10** variants; pick 1–2 sharp keepers.

### 2. Style direction (pick ONE)

**A. Editorial photo (recommended for clients)**  
Looks like a quiet magazine / personal site headshot. Minimal AI “artifice.”

**B. Paper & ink stylized photo**  
Halftone / soft grain / desaturated warm paper tones — matches startpage DNA without going illustration-only.

**C. Soft illustrated portrait**  
Line + wash, limited palette — more personal brand, slightly less “invoice face.” Fine if paired with real name and professional copy.

→ For **client work primary**, prefer **A** or light **B**. Use **C** only if you still clearly resemble the source.

### 3. Midjourney workflow that keeps likeness

1. Upload selfie as **image reference / omni-reference** (weight high enough that face holds).  
2. Use a **character reference** if your MJ version supports consistent face from the same image.  
3. Generate a **grid**, pick closest likeness, then **vary (subtle)** — not re-roll into a new person.  
4. Export highest res; do final crop in Photos/Figma (eyes on upper third).  
5. Make **square 1024** master; derive site avatar, favicon monogram optional separate.

### 4. Prompt starters (edit to match you)

**Editorial (primary):**

```text
Professional headshot portrait of the person in the reference photo,
likeness preserved, natural skin texture, soft window light, neutral
expression, plain warm off-white background, shallow depth of field,
editorial photography, 85mm, muted colors, no heavy retouching,
no beauty filter, photorealistic --stylize low
```

**Paper & ink (portfolio match):**

```text
Portrait of the person in the reference photo, likeness preserved,
desaturated warm paper tones, subtle film grain, soft halftone texture,
minimal background, quiet editorial mood, natural face, no cyberpunk,
no neon --stylize medium-low
```

**Soft illustration (optional secondary):**

```text
Limited-palette illustrated portrait of the person in the reference,
likeness preserved, clean linework, warm paper background, Swiss poster
restraint, adult professional, no anime eyes, no exaggerated features
```

Add your real details if MJ drifts: short hair color, facial hair yes/no, glasses yes/no, approximate age.

### 5. Negative / ban list in prompts

```text
no anime, no cartoon exaggeration, no cyberpunk, no neon, no headset,
no suit-and-tie stock CEO unless you wear that, no plastic skin,
no extra fingers, no warped eyes, no celebrity morph
```

---

## Site usage sizes

| Use | Size | Notes |
|-----|------|-------|
| Avatar on site | 256–512 display, 2x source | Circle or soft square |
| Apple touch / PWA | 180, 192, 512 | Can be monogram if face too small |
| Favicon | Prefer **monogram “H”** or abstract mark — face fails at 16px |
| OG image | Face small or omit; prefer type + one still | See OPUS prompt assets |

**Favicon recommendation:** Do **not** use the selfie as favicon. Use a simple **H** monogram or geometric mark in ink-on-paper colors. Profile photo lives in hero/about only.

---

## Alternatives if MJ likeness fails

1. **Well-lit real photo + light grade** (Curves, grain, desaturate) — often best for clients  
2. **Black-and-white crop** — hides phone quality, looks intentional  
3. **No face** — initials + strong type (Dead Simple compatible); less personal but safe  

Many top dead-simple portfolios use **no photo**. That’s valid. Photo helps freelance trust if it looks human and calm.

---

## Decision guide

| If you want… | Choose |
|--------------|--------|
| Max client trust | Real photo, light grade, or low-stylize MJ editorial |
| Match paper site vibe | Paper/ink grade on real photo or subtle MJ B |
| Personality / art | Soft illustration secondary; keep real photo for LinkedIn |
| Lowest risk | Skip face on site; monogram + name |

**Recommendation:**  
**Primary:** editorial photo-real (source selfie + low stylize MJ **or** real photo grade).  
**Site system:** monogram favicon + same avatar crop in about.  
**Don’t:** let the avatar become a second brand that fights the minimal site.
