# GitHub feature tiers (@8tp)

**Audit date:** 2026-08-04 · **~41 public repos**  
Stars are a weak signal (mostly 0–4). Rank by polish, live demo, systems depth, narrative fit.

---

## Tier S — Must feature (depth)

| Project | Live | Stack signal | Notes |
|---------|------|--------------|-------|
| [Instagib Arena](https://github.com/8tp/instagib-arena) | [instagib.win](https://instagib.win) | TS, Three.js, Node/ws, SQLite | Server-authoritative FPS; keep spotlight |
| [Palhelm](https://github.com/8tp/palhelm) | [palhelm.com](https://palhelm.com) | Go, Svelte, Docker | Self-hosted product; keep spotlight |
| [Coup](https://github.com/8tp/Coup) | [coup.8tp.dev](https://coup.8tp.dev) | Next.js, Socket.io | Elevate — best social multiplayer demo |
| [Vitals](https://github.com/8tp/Vitals-Command-Center) | [vitals.8tp.dev](https://vitals.8tp.dev) | TS, Fastify, React, SQLite, MCP | Add if still standing behind it; big missing self-host story |
| **Aeperion** (client, not GH) | [aeperion.com](https://aeperion.com) | Shopify | Case study section |

---

## Tier A — Strong secondary

| Project | Live | Notes |
|---------|------|-------|
| [TypeDuel](https://github.com/8tp/typeduel) | [duel.8tp.dev](https://duel.8tp.dev) | Realtime typing combat |
| [ScreenCap](https://github.com/8tp/ScreenCap) | — | macOS flagship; promote out of utilities pile |
| [Palhelm Bot](https://github.com/8tp/palhelm-bot) | docs.palhelm.com | Child of Palhelm |
| [HudAim](https://github.com/8tp/hudaim) | [aim.8tp.dev](https://aim.8tp.dev) | Optional if gaming grid stays |

---

## Tier B — Supporting / also built

| Project | Notes |
|---------|-------|
| [AntMaze](https://github.com/8tp/AntMaze) | Craft constraint (~10KB), playable |
| [wc26-bracket](https://github.com/8tp/wc26-bracket) | Fresh creative viz |
| [netmap](https://github.com/8tp/netmap) | Best TUI systems story |
| [tidewatcher](https://github.com/8tp/tidewatcher) | Rust TUI aesthetic |
| [startpage](https://github.com/8tp/startpage) | Design taste sample |
| [ghgarden](https://github.com/8tp/ghgarden) | Optional; cut if netmap/tidewatcher stay |
| LiteStats, Recopy | Collapse under “macOS utilities” with ScreenCap elevated |

---

## Tier C — Skip or GitHub-only dump

- Forks: fossroot, goose, spotify-player, parameter-golf, starter-web, react-tak, dtak-react-native-CoT, chudopoly  
- Still family (launcher, notes, cal, clock, contacts, dialer, sms, voice) — not actively owned  
- DevDock — Electron; clashes with “native / no Electron” posture for now  
- Thin: iq-test, Resources, AppMixer  
- DTAK-UI-MAPS — stale / vertical mismatch for public freelance narrative  
- Meta: 8tp, 8tp.dev themselves  

---

## Suggested homepage counts

| Slot | Count | Examples |
|------|------:|----------|
| Spotlights | 2–3 | Instagib, Palhelm, (+ Coup or Vitals) |
| Client cases | 1 | Aeperion |
| Featured grid | 4–6 | Coup, TypeDuel, ScreenCap, Vitals, Palhelm Bot… |
| Utilities list | 4–6 compact | netmap, tidewatcher, LiteStats, Recopy… |
| Also | 2–4 | AntMaze, wc26, startpage |

Link: “All repositories → github.com/8tp” for the rest.

---

## Data model notes for rebuild

Current: `src/data/projects.ts` with `spotlight` / `featured` / `live` flags.

Recommended extensions:

```ts
tier: 'spotlight' | 'featured' | 'utility' | 'also' | 'client'
kind: 'game' | 'selfhost' | 'native' | 'client' | 'tool' | 'design'
```

Client projects may live in a separate `clients.ts` with case-study fields (before/after paths, outcomes).
