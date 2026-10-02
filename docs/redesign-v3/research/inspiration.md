# Inspiration: X (via Grok), Dead Simple Sites, freelance sites

**Gathered:** 2026-10-02. All site URLs returned HTTP 200 that day. X post links were
checked against the public syndication endpoint (author and date match).

---

## How the X search was run (re-runnable)

`/opt/homebrew/bin/grok` is a stale 0.2.117 binary the server rejects (426). The current
one is `~/.grok/bin/grok` (1.0.46). Read-only, X/web search only:

```sh
cd /tmp/grokq && perl -e 'alarm shift; exec @ARGV' 1500 ~/.grok/bin/grok \
  --prompt-file /tmp/grokq/p1.txt --cwd /tmp/grokq --sandbox read-only \
  --tools web_search,web_fetch --no-subagents --output-format plain > /tmp/grok-1.txt
```

Give each prompt a budget (~20 searches, ~6 page opens) or it fills its context and stalls.

---

## Dead Simple Sites

[deadsimplesites.com](https://deadsimplesites.com) — run by Mason Watson (Arcade Labs),
~530 sites, **one flat grid, no categories**. Picks for a solo dev who takes client work:

| Site | Steal |
|---|---|
| [bigskillet.com](https://bigskillet.com) | Whole homepage is a ledger: `Year · Client · with [studio]`. Credits the designer. Includes Shopify builds. |
| [bocc.dev](https://bocc.dev) | Work table `Year / Project / Partner / Service / Link`, **WIP rows on top** = quietly busy. |
| [arcade.la](https://arcade.la) | Solo practice framed as a studio. Availability is two words: **"Available 2027"**. One mailto CTA. |
| [aaronrolston.com](https://aaronrolston.com/services) | Services split **by who's buying**. "Projects start at $5,000 · 2–3 week timeline." Payment terms stated. |
| [cody.software](https://www.cody.software) | Best dev case-study format: what the client is, stack + design credit, then **captioned clips of specific interactions**. Has a Shopify case (/manos). |
| [hunterjennings.dev](https://www.hunterjennings.dev) | Case page: paragraph, what was built, stack, credits, `Contributions / Dates / Visit Site`. |
| [jonasbrinkhoff.com](https://www.jonasbrinkhoff.com) | One "Availability: Not available" field. Copy-email button. |
| [ashconnolly.com](https://ashconnolly.com) | Client names inline in the intro sentence; "Currently available for new projects." |
| [frilo.io](https://www.frilo.io) | `→` for internal case pages, `↗` for external products. |
| [adamwhitcroft.com](https://adamwhitcroft.com) | **Closest analogue**: client commissions and own shipped apps in one place without friction. |
| [some.studio](https://some.studio) | One paragraph of client history, then "today we focus on our own products." |
| [samking.studio](https://samking.studio) | "A studio of one." Registered-company footer for cheap credibility. |
| [franguerrero.dev](https://franguerrero.dev) | Smallest workable version: toys and client sites in one list, name + one line. |
| [kulpinski.dev](https://kulpinski.dev) | `Name — pitch · MM.YYYY`. Dates make a short list read as a track record. |
| [jim-nielsen.com](https://jim-nielsen.com) | Testimonials handled with wit, short attributed quotes. |
| [glenn.me](https://glenn.me) | "Last updated September 2026" makes a status line trustworthy. |

Also: [paco.me](https://paco.me), [nelson.co](https://nelson.co), [chuckbuilds.it](https://www.chuckbuilds.it).

### Other galleries

[minimal.gallery](https://minimal.gallery) (closest to DSS, has Portfolio filter),
[siiimple.com](https://siiimple.com), [onepagelove.com](https://onepagelove.com),
[curated.design](https://curated.design), [personalsit.es](https://personalsit.es),
[hoverstat.es](https://www.hoverstat.es) (texture/print side), [512kb.club](https://512kb.club),
[typewolf.com](https://www.typewolf.com). Anti-references: recent.design (ex-godly), Awwwards.

---

## From X (Grok)

### Developer / design-engineer sites

| Site | Steal |
|---|---|
| [jem.computer](https://jem.computer) — [post](https://x.com/sheherenow_/status/2102572017790927085) | Threw out the "sloptimized" case-study portfolio; type on a Gerstner grid shared by HTML and WebGPU. |
| [rauno.me](https://rauno.me) | One-screen index; old site versions kept at their own URLs. |
| [callum.website](https://www.callum.website) | Client work, tools and essays in **one dated stream**, no nav. |
| [karlkoch.me](https://karlkoch.me) | One line for role, one for what he did. |
| [portfolio.mariedrouvin.com](https://portfolio.mariedrouvin.com) | Closest mix to Hunter's: native macOS widget + client site + small utilities. |
| [andrewallsop.com](https://www.andrewallsop.com) | **Best dither reference**: Constable cloud studies in the margin, different pair per load, captioned. |
| [mackenziechild.me](https://www.mackenziechild.me) | Career as a ruler of years; freelance as its own band. |
| [martintale.com](https://martintale.com) | Shipped games, apps and client sites in one index; 12 hidden interactions. |

### Freelance / small studio

| Site | How it sells |
|---|---|
| [artemiilebedev.com](https://artemiilebedev.com) | Plain list; contact form **requires a budget band + timeline**. |
| [glenncatteeuw.com](https://glenncatteeuw.com) | "Available for freelance work October 2026"; every case ends with the same email line. |
| [gregorylalle.com](https://gregorylalle.com) | Each project labelled solo / with partner / at studio. Stale "Available Q1 2026" = the risk of availability text. |
| [seb.cat](https://seb.cat) | Client work first screen + a "One year of freelance" essay naming clients. |
| [willie.works](https://www.willie.works) | Case = one paragraph of goal, images, credits, live link (e-commerce example). |
| [afterimage.id](https://afterimage.id) | "Reject: the kitschy, the cheesy…" — say who you won't work with. [Thread](https://x.com/lee94josh/status/2105328827870413008). |
| [csswizardry.com](https://csswizardry.com) | Contact-page FAQ answers questions before you write. Email + optional call. |

Advice: show the work you want *next* ([post](https://x.com/slaterdesign/status/2104724689650348400));
a video + Cal.com link closed the deal, not the portfolio ([post](https://x.com/anthonysmendes/status/2031323222172643609)).

### Video done well

| Site | Steal |
|---|---|
| [adamfuhrer.com](https://adamfuhrer.com) — [post](https://x.com/adamfuhrer/status/2081171939796602922) | ~3 s muted hover loops, 200 ms delay before preload, lazy near viewport, colour placeholders. |
| [devouringdetails.com](https://www.devouringdetails.com) | Every detail is a tight screen recording. |
| [kasturi.live](https://kasturi.live) | Plays once and stops; explicit play/pause; one-line outcome under each. |
| [carterogunsola.com/xp](https://carterogunsola.com/xp) | Print-inspired stop motion; paper instead of UI. Close to this site's look. |
| [paodao.fr](https://paodao.fr), [bruno-simon.com](https://bruno-simon.com) | Playable portfolios. For Instagib: let people *play* rather than watch. |

### Minimal, strong type

[stephango.com](https://stephango.com), [emilkowal.ski](https://emilkowal.ski) (one font size, on purpose),
[edw.is](https://edw.is) (warning: he now finds pure minimal too bland, adding "comfy stuff"),
[nat.org](https://nat.org), [robbowen.digital](https://robbowen.digital) (texture done right),
[gwern.net](https://gwern.net), [danluu.com](https://danluu.com).

### AI-slop discourse (2026)

- [mitchellh](https://x.com/mitchellh/status/2087939678695805147): bounces off AI-designed pages — thin lines, glow, inconsistent fonts, lots of monospace.
- [pbakaus](https://x.com/pbakaus/status/2010480866276114616): purple gradients, Inter, cards everywhere, Lucide icons in boxes, glass, hero metrics.
- **Instrument Serif is now an AI tell** ([1](https://x.com/meh_agarwal/status/2052530666571792616), [2](https://x.com/krispuckett/status/2104771639015780626)). Don't use it as display.
- [DesignArena](https://x.com/DesignArena/status/2049922138564637083): models still can't do grain/paper/hand marks — texture reads as human. The dither plate is on the right side of this.
- [benjitaylor](https://x.com/benjitaylor/status/2096656821591413161): "A personal website should feel like you've briefly left the rest of the internet."
- Eyebrow labels above headlines are a tell ([post](https://x.com/MichaelFilipiuk/status/2104877557145272483)). Glassmorphism is the 2026 purple gradient.

---

## Patterns that recur across all three sources

1. **Lists, not cards.** A dated ledger holds a game, a Mac app and a Shopify job in one column.
2. **One line of role, one of what you did.** Credit the designer/partner when there was one.
3. **Availability is one dated sentence**, and it must be kept current or it backfires.
4. **Email as text beats forms.** Cal.com as an optional second path on sites that sell harder.
5. **Pricing, if shown, is a floor** ("projects start at $X"), never a rate card.
6. **Dev case studies are short**: client, what was built, stack, credits, captioned clips.
7. **Video**: short muted loops, poster first, lazy, pause off-screen, visible pause control.
8. **Texture and print framing beat effects.** Small personal touches signal taste.
