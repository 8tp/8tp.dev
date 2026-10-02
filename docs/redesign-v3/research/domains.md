# Domains

**Checked:** 2026-10-02 via registry RDAP / whois. "Available" = likely unregistered now,
not a price guarantee. Supersedes the availability table in
[../../redesign/03-domains-and-email.md](../../redesign/03-domains-and-email.md), which
wrongly lists hunterm.dev as unavailable.

## Corrections

- **hunterm.dev is yours**: registered 2026-08-05, on the same Cloudflare nameservers as 8tp.dev.
- **.sh is Saint Helena**, not the Chagos/BIOT ccTLD. That's **.io**. The UK–Mauritius treaty
  is signed but still unratified; .io keeps running and any retirement would take 5+ years.
  .sh has no such risk; its downsides are price (~$45/yr) and explaining it to non-technical clients.

## Availability

**hunterm** — hunterm.dev (yours) · hunterm.com taken (Hunter & Michaels recruiting) ·
hunterm.net parked/for sale · hunter.sh taken · available: hunterm.sh, .co, .io, .so,
.me, .app, .studio, .works, huntermstudio.com, byhunter.dev, madebyhunter.com,
workwithhunter.com.

**Huddled** — huddled.com taken (Huddled Group plc) · huddled.dev registered 2026-08-17
on different Cloudflare nameservers (probably not yours) · huddled.gg for sale ·
huddled.app "coming soon", **expires 2026-10-04** · available: huddled.sh, .studio, .works,
.co, .io, .so, .games, .software, huddledstudio.com, huddledgames.com, huddledlabs.com.

**8tp** — 8tp.com taken · available: 8tp.studio, .co, .sh, .io, .so, .gg, .works.

**Studio names** — available: lockstep.studio, lockstepsoftware.com, tickrate.studio,
runloop.studio, framepace.studio, fletchsoftware.com. Most short craft/netcode names
(.dev especially) were registered during 2026. Collisions: Lockstep (Sage's AR product,
lockstepstudio.com is a live business), Tickrate (TickrateFrance sells UE multiplayer
tools), Runloop (runloop.ai).

## Renewal / yr (Cloudflare at-cost, via cfdomainpricing.com)

.com 10.46 · .dev 12.20 · .app 14.20 · .me 16.56 · .games 26.20 · .co 30.00 · .works 30.20 ·
.studio 31.20 · .sh ~45 (Cloudflare support unclear, check dashboard) · .io 50 ·
.gg / .so not on Cloudflare.

## Brand notes

- **hunterm**: reads as a person, matches "Hunter M.", nothing to explain. Risk: clients
  typing .com land at a recruiting firm. Say "hunter-M dot dev"; write it HunterM in print.
- **Huddled**: a UK app-dev shop, *Huddled Tech App Development* (2017), does exactly this
  work. Slack "huddles", Huddle (2006), 1Huddle crowd search. "Huddled masses" reads as
  hunkered-down, not precise. Good gaming handle, weak invoice letterhead.
- **8tp**: hard to say on a call, .com taken. Keep as GitHub handle and game subdomains.
- **Studio label**: invoicing under one needs a DBA or LLC; a name domain needs nothing.

## Setups

1. **hunterm.dev primary (recommended).** `hunter@hunterm.dev`, `hello@` alias. 8tp.dev 301s
   to it; `hunter@8tp.dev` forwards forever; games stay on `*.8tp.dev`; GitHub stays @8tp.
   Needs a sending mailbox (Fastmail / Workspace / iCloud+) with SPF/DKIM/DMARC — Cloudflare
   Email Routing only receives.
2. **hunterm.dev + a studio .com for invoices** (e.g. lockstepsoftware.com). Only if
   subcontracting or wanting business separate from person. Needs DBA/LLC.
3. **Huddled as a games label only** (huddled.studio, huddledstudio.com → redirect).
   Client work stays on hunterm.dev.
