# Project audit

**Snapshot:** 2026-10-02. Every listed website returned 200 in < 0.75 s; none parked.

## On the site today

| Project | Tier | Last real work | ★ | Live | Preview |
|---|---|---|---|---|---|
| Instagib Arena | featured | 10-02, active (training courses) | 4 | instagib.win | **stale** (captured 08-06) |
| Palhelm | featured | 08-02 | 5 | palhelm.com | fresh |
| Palhelm Bot | child | 07-15 | 2 | docs.palhelm.com | none |
| Imprimatur | featured | 08-03 | 0 | — | fresh |
| Coup | featured | 10-02, onboarding rework + new icons | 3 | coup.8tp.dev | **stale**; scripted "Tutorial" click may break |
| startpage | featured | 07-31 | 1 | — | fresh |
| ScreenCap | featured | 03-11 | 4 | — | **none** (only featured entry without one) |
| Vitals | featured | 06-23 | 3 | vitals.8tp.dev (login wall) | fresh |
| TypeDuel | more | 03-12 | 0 | duel.8tp.dev | fresh |
| HudAim | more | 03-01 | 1 | aim.8tp.dev | fresh |
| netmap | more | 03-05 | 2 | — | — |
| TideWatcher | more | 03-02 (README) | 0 | — | — |
| LiteStats | more | 02-28 (README) | 1 | — | — |
| Recopy | more | 03-09 | 1 | — | — |
| AntMaze | more | 03-18 | 0 | ant.8tp.dev | — |
| wc26-bracket | more | 09-15 (automated data only) | 0 | 8tp.github.io/wc26-bracket | — |

Aeperion case frames (light + dark) date from 08-06. The private repo has ~430 commits
since across branches; `feat/site-v2` is **not live** — check the live store by eye.

## Shipped work not on the site

| Project | What | Live | Notes |
|---|---|---|---|
| **Aimperion** | Raw-input browser aim trainer built for Aeperion; server replays every run's input tape before ranking. Electron launcher in alpha. | aimperion.com | Private repos. ~3,150 runs / 546 players per prod backup note (re-count before publishing). Trailer exists. |
| **Hatchdle** | Daily egg-hatch game: server-rolled (HMAC of player + day), 36 creatures, streaks, Dex, badges. Cloudflare Pages + D1, Preact, GSAP. | hatchdle.com | Private repo, so no source link. Days old. Art is AI-generated — describe accordingly. Trailer exists. |
| **MouseRank** | Site for boardzy: spec catalog, tier-list builder, mouse finder, reviews. | mouserank.org | Looks like client work. Production release 09-28. Note mouserank**.com** is someone else. |
| Chudopoly | Air Force-themed multiplayer Monopoly Deal | chudopoly.deal | Public, 2★ |
| GhostClip | E2E-encrypted clipboard | ghostclip.org | Self-hosted Forgejo |
| Foyer | Android TV launcher | — | Private |
| Fossroot, Still family | — | — | Previously declined. Leave off. |
| chuds-arcade, instagib-client, gatecrash | — | — | Prototype / empty / undeployed. Leave off. |

**Check:** `arcade.8tp.dev` is live and says "Arcade games by Aodom". No matching repo
found. Confirm who controls it (a stale DNS record pointing at someone else's host is a
subdomain-takeover risk).

## Video assets on disk

| File | Size | Length | Format |
|---|---|---|---|
| `~/Downloads/instagib-arena-trailer.mp4` | 147 MB | 92 s | 1080p60 h264+aac |
| `~/Downloads/aimperion-trailer.mp4` (latest; `-v1` is an earlier cut) | 60 MB | 80 s | 1080p60 |
| `~/Downloads/hatchdle-trailer.mp4` | 52 MB | 67 s | 1080p60 |
| palhelm.com `/hero/hero-ambient.{mp4,webm}` | 1.3 MB / 216 KB | 20 s | 1264×720 loop, already live |
| `~/src/sites/Aeperion/public/render/hero*` | 0.7–4.4 MB | 14 s | 1600×1000 loops |

Trailer tooling: `~/hatchdle/tools/trailer/`, `~/src/sites/Aimperion-trailer/scripts/trailer/`.
Working media in `/tmp/ig-trailer`, `/tmp/aimtr`, `/tmp/hatchtr` — **temp, copy out before it's wiped.**
None of the trailers are published anywhere yet.

## Capture pipeline today

`scripts/capture-stills.mjs`: headless Chrome over raw CDP, 1440×900 @2x, 8 live URLs
(header comment says nine). Imprimatur and startpage were captured by hand.
`pnpm assets` grades and encodes to WebP.
