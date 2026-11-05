# Top Down Tanks

A turn-based tank game for desktop and mobile browsers: solo or co-op enemy waves for 1–4 players, and PvP for 2–4 players.

**[Play the live game](https://halfway-tanks-tom.thomasram98.chatgpt.site)** · [Setup](docs/SETUP.md) · [Architecture](docs/ARCHITECTURE.md) · [Development history](history/README.md)

## The game

Create a room, invite friends by code or use the lobby browser, choose tank colors, and let the host start the match. Play PvP free-for-all with personal fog of war, or fight waves of enemy tanks solo or with friends. To play solo, select Co-op waves, create a room, and press Start match.

- Free movement with a movement preview and turn budget.
- Turret rotation: tap for fine aiming or hold to accelerate.
- Physical projectile paths, wall collisions, ricochets, shields, and damage effects.
- Normal, Bank, Spread, Piercing, Chain, Bomb, Cluster, Longshot, and WMD ammunition.
- WMD combines blast, fragments, and chain effects simultaneously on detonation, with up to three bounces and no bounce damage bonus.
- Co-op enemy classes, individual bonus-card choices, and random map pickups.
- Co-op arenas grow with the wave's starting enemy count.
- Room chat, global lobby chat, a lobby browser, rematches, and spectator behavior.

## Technology

TypeScript, React, SVG rendering, Next.js-style App Router through Vinext/Vite, Cloudflare Workers, Cloudflare D1, and Drizzle ORM. Multiplayer clients poll authoritative API state; server-side turn validation and database version checks handle competing updates.

This is a full-stack application. GitHub stores the source; the live game runs on separate hosting. GitHub Pages alone cannot run its multiplayer API and database.

## Run and verify

Use **Node.js 24** and the pnpm version pinned in `package.json`. See [SETUP.md](docs/SETUP.md) for installation, database initialization, and local serving.

```sh
node --experimental-strip-types --test tests/*.test.mjs
```

All 29 test files, type checking, and the production build passed for the solo co-op update. The new regression test covers solo bonus selection, enemy turns, wave transitions, defeat, and rematches. Browser playtesting remains unverified because the preview connection was refused.

## Project ownership and process

**Thomas Ramirez (@WhisperSilk-Cloak)** developed the game concept, directed gameplay and feature decisions, playtested iterations, and provided feedback that shaped the implementation. The project was developed with ChatGPT/Codex assistance for implementation, debugging, tests, and deployment.

The source history contains 47 original commits attributed to Codex. They are preserved in a Git bundle with their original metadata; this GitHub import does not reattribute or backdate them. See [history/README.md](history/README.md) to recover those versions.

## Repository map

| Path | Purpose |
| --- | --- |
| `app/page.tsx`, `app/globals.css` | Game interface and visual presentation |
| `components/` | Bonus cards, chat, lobby, and shared UI components |
| `lib/game.ts` | Authoritative game rules, combat, AI, and visibility |
| `app/api/` | Game, room-chat, and global-lobby endpoints |
| `db/`, `drizzle/` | Database schema and SQL migrations |
| `tests/` | Game and supporting-logic regression tests |
| `worker/`, `scripts/`, `vite.config.ts` | Runtime and build integration |
| `public/`, `vendor/` | Static assets and vendored styles/licenses |
| `history/` | Original development history and recovery instructions |

## Scope and next steps

This is a playable prototype. Future ideas include additional enemy classes and team PvP. Balance, mobile readability, and synchronization across physical devices remain areas for continued playtesting.

The original starter documentation is retained in [docs/STARTER.md](docs/STARTER.md). Existing third-party license notices are preserved. A project-wide license has not yet been selected.
