# Domains & email

> **Superseded 2026-10-02:** Hunter owns **hunterm.dev** (registered 2026-08-05). See [../redesign-v3/research/domains.md](../redesign-v3/research/domains.md).

**Posture:** Prefer a **human name** domain for client trust. Keep GitHub **@8tp**. Drop heavy “8tp” site branding long-term.  
**DNS notes below are not purchase guarantees** — confirm at a registrar.

---

## Availability updates (2026-08-04)

| Domain | Status |
|--------|--------|
| **hunterm.dev** | **Not available** (confirmed by owner) |
| hunterm.com | Taken (recruiting firm) |
| hunter.dev | Taken (another Hunter) |

Do **not** treat hunterm.dev as the target domain in build copy. Site stays domain-agnostic until a name is purchased.

---

## Final recommendation (revised)

| Role | Pick |
|------|------|
| **Primary (check first)** | **`byhunter.dev`** · `hi@` or `hunter@byhunter.dev` — short, craft, name-forward |
| **Strong .com commercial** | **`madebyhunter.com`** · `hello@` / `hunter@` — best invoice/client trust |
| **Hire CTA domain** | **`workwithhunter.com`** · `hello@` — optional secondary |
| **Vanity engineer** | **`hunterm.sh`** · `hunter@hunterm.sh` — only if you like shell TLD |
| **Keep forever** | **`8tp.dev`** → 301 + email forward |

### Best email pattern (once domain locked)

**Primary:** `hunter@<your-domain>`  
**Public form alias:** `hello@<your-domain>` (same inbox)  
**Forever forward:** `hunter@8tp.dev` → new inbox  

Avoid as primary: `contact@` (faceless), `admin@`, pure handle-only.

### Buy-order suggestion

1. Check **`byhunter.dev`** and **`madebyhunter.com`**  
2. Optional: `workwithhunter.com`, `hunterm.sh`, `justhunter.dev`  
3. Keep building on **8tp.dev** until one is registered — config only, no hard rebrand mid-build  

---

## Top candidates (ranked, post hunterm.dev)

| Rank | Domain | Tone | Suggested email | Notes |
|-----:|--------|------|-----------------|-------|
| 1 | **byhunter.dev** | Craft attribution | hunter@byhunter.dev | Best short replacement for hunterm.dev |
| 2 | **madebyhunter.com** | Service / attribution | hello@madebyhunter.com | Max client trust; longer |
| 3 | **workwithhunter.com** | Hire CTA | hello@… | Strong freelance signal |
| 4 | **hunterm.sh** | Engineer / shell | hunter@hunterm.sh | You considered this; explain TLD to non-tech |
| 5 | **justhunter.dev** | Soft personal | hello@… | Friendly; weaker invoices |
| 6 | codebyhunter.dev | Engineer phrase | hunter@… | A bit generic |
| 7 | builtbyhunter.dev | Service | hello@… | .com often taken |
| 8 | hunter.codes | Minimal | hi@… | First-name collision risk |
| 9 | hunterm.io | Startup-ish | hunter@… | Only if .sh/.dev phrases fail |
| — | ~~hunterm.dev~~ | — | — | **Unavailable** |

### Avoid / blocked

| Domain | Why |
|--------|-----|
| **hunterm.dev** | Not available |
| hunterm.com | Taken (recruiting firm) — type-in conflict |
| hunter.dev | Taken (another Hunter) |
| hntr.* | Often taken; vowel-drop handle |
| Primary 8tp.* for client email | Weak on invoices; retiring heavy 8tp brand |

---

## TLD cheat sheet

| TLD | For you |
|-----|---------|
| **.dev** | Best default for portfolio + eng email |
| **.com** | Best for non-tech client trust if phrase is clean |
| **.sh** | Fun engineer vanity; not sole commercial face |
| **.io** | Optional; not better than .dev here |
| **.me / .fyi** | Satellite only |

**Rule:** One domain owns site + professional email. Optional second `.com` phrase for proposals can 301 to primary.

---

## Identity stack

| Layer | Value |
|-------|--------|
| Human name | Hunter M. |
| Site | byhunter.dev / madebyhunter.com / TBD (not hunterm.dev) |
| Email | hunter@\<primary\> |
| GitHub | @8tp (unchanged) |
| Products | palhelm.com, instagib.win, etc. (unchanged) |

**Signature example:**

```text
Hunter M.
Software engineer · Web & product
byhunter.dev   ← swap when registered
github.com/8tp
```

---

## Migration off 8tp.dev (when ready)

1. Register primary domain  
2. Email: set new inbox; forward `hunter@8tp.dev` indefinitely  
3. 301 apex + www of 8tp.dev → new site  
4. Games on `*.8tp.dev` can stay until they earn product domains  
5. Update GitHub website field, LinkedIn, invoices, OG tags  
6. Do **not** drop 8tp.dev registration for years  

**Build implication:** site config must be domain-agnostic (`site.url`, `site.email`, title not hard-coded as “8tp.dev” everywhere).

---

## Optional two-domain kit

1. Short portfolio domain (`byhunter.dev` or similar — **not** hunterm.dev) — home, OSS  
2. `madebyhunter.com` or `workwithhunter.com` — client proposals / hire  
3. `8tp.dev` — permanent redirects + game subdomains  
4. Product apexes stay product apexes  
