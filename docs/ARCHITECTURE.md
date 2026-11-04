# Architecture and design

The React client renders the battlefield in SVG and submits player actions to the game API. Clients poll for room updates and interpolate motion using server-provided animation timestamps.

`lib/game.ts` owns movement validation, aiming, collision paths, damage, inventory, turn transitions, wave generation, enemy behavior, and visibility. PvP responses filter hidden player information. The database update checks the room version to reject conflicting writes rather than silently overwrite another action.

Cloudflare D1 stores rooms and chat through the Drizzle schema in `db/schema.ts`. SQL migrations are committed under `drizzle/`. The game, room chat, and global lobby use separate API routes.

## Design decisions

- Turn-based combat accommodates cross-device play and gives players time to position and aim.
- Rotation controls require players to line up shots; battlefield taps are used for movement rather than target locking.
- Server-owned combat results keep damage, inventory, and turn order consistent between clients.
- Co-op difficulty changes enemy composition, and arena size follows the starting enemy roster.
- Individual inventories and bonus choices give each player control over their loadout.

## Verification boundaries

Automated tests cover core gameplay, timing, multiplayer slots, visibility, inventory, chat validation, and lobby behavior. They do not replace physical-device testing or a production security assessment. The latest WMD/Longshot/arena changes had no verified browser playtest in the original deployment session.
