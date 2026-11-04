# Local setup

## Requirements

- Node.js 24 (the tests import TypeScript directly).
- The pnpm version pinned in `package.json` (`11.25.0` for this snapshot).
- Windows, macOS, or Linux; network access to dependency registries for installation.

Clone the repository, then run the following from its root:

```sh
git clone https://github.com/WhisperSilk-Cloak/top-down-tanks.git
cd top-down-tanks
pnpm install --frozen-lockfile
pnpm run build
```

A clean clone defaults to the portable execution profile. The Vite configuration supplies a placeholder D1 ID for local use. A build produces `dist/server/wrangler.json`.

## Initialize the local database

Apply these migrations in order to a fresh local database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_chilly_argent.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_steep_amphibian.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_condemned_ultron.sql
pnpm run start
```

Use the local URL printed by Wrangler. This starts the built application with local persisted database state. Do not replay these SQL files against a database where they are already applied. For source editing, `pnpm run dev` starts the development server; check its local database state before creating rooms.

## Checks

```sh
node --experimental-strip-types --test tests/*.test.mjs
pnpm exec tsc --noEmit
pnpm run build
```

## Hosting

The existing public game remains hosted through ChatGPT Sites. `.openai/hosting.json` retains its original Site identifier and DB binding as part of the source snapshot; it contains no hosting credential. Do not deploy another person's clone into that Site identity. Independent hosting requires your own Cloudflare Worker/D1 configuration and migrations, or a new Sites project identity.

The game API stores room state, membership tokens, and chat in D1. These runtime records are not part of the repository. The optional ChatGPT identity/connector helpers come from the starter; equivalent hosted integrations are not automatically supplied by GitHub.

Dependencies, generated builds, local databases, environment files, and credentials are excluded from the source export. Build output can be regenerated from the source and lockfile. These commands follow the checked-in configuration; fresh installation and independent hosting were not validated during this export.
