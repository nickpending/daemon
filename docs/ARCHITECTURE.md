# Architecture

This document describes the data flow architecture for Daemon, including the build-time parser that ensures a single source of truth.

## Overview

Daemon uses `public/daemon.md` as the **single source of truth** for all content. Both the human-viewable dashboard and the MCP server derive their data from this file.

## File Structure

```
daemon/
├── public/
│   └── daemon.md              ← SOURCE OF TRUTH (edit this)
├── scripts/
│   └── parse-daemon.ts        ← Parser script
├── src/
│   ├── types/
│   │   └── daemon.types.ts    ← Type definitions
│   ├── generated/             ← GITIGNORED (auto-generated)
│   │   └── daemon-data.ts     ← Generated TypeScript
│   └── components/
│       ├── DaemonDashboard.tsx  ← Imports from generated
│       └── Hero.tsx             ← Imports from generated
```

## Data Flow

```
┌─────────────────┐
│  daemon.md      │  ← You edit this
│  (public/)      │
└────────┬────────┘
         │
         │  bun run parse-daemon
         ▼
┌─────────────────┐
│ parse-daemon.ts │  ← Reads markdown, extracts sections
│ (scripts/)      │
└────────┬────────┘
         │
         │  Writes TypeScript
         ▼
┌─────────────────┐
│ daemon-data.ts  │  ← Generated file (gitignored)
│ (src/generated/)│
└────────┬────────┘
         │
         │  Import at build time
         ▼
┌─────────────────┐     ┌─────────────────┐
│ DaemonDashboard │     │    Hero.tsx     │
│     .tsx        │     │                 │
└─────────────────┘     └─────────────────┘
```

## Build Commands

| Action | Command | What Happens |
|--------|---------|--------------|
| **Dev mode** | `bun run dev` | Parser runs first, then Astro dev server starts |
| **Build** | `bun run build` | Parser runs via `prebuild` hook, then Astro builds |
| **Parser only** | `bun run parse-daemon` | Just regenerates `daemon-data.ts` |

## Workflow: Updating Content

1. Edit `public/daemon.md`
2. If dev server running: restart it (`bun run dev`)
3. If building for deploy: `bun run build` handles it automatically

## MCP Server (Separate Path)

The MCP server reads `daemon.md` **directly at runtime** - it doesn't use the generated file. This means both the dashboard and MCP server derive from the same source:

```
daemon.md ──┬──> parse-daemon.ts ──> Dashboard (build-time)
            │
            └──> MCP Server (runtime fetch)
```

**Single edit, both update.**

## Why Build-Time Parsing?

1. **Single source of truth** - Edit once, update everywhere
2. **Type safety** - Generated TypeScript provides compile-time checks
3. **No runtime fetch** - Dashboard loads instantly with bundled data
4. **Maintainability** - No duplicate content to keep in sync

## Adding New Sections

To add a new section to `daemon.md`:

1. Add the section to `public/daemon.md`:
   ```markdown
   [NEW_SECTION]
   Content here...
   ```

2. Update the parser in `scripts/parse-daemon.ts` to handle the new section

3. Update types in `src/types/daemon.types.ts`

4. Update components to display the new data

## Local Development

For local testing with custom hostnames, use environment variables:

```bash
# Create .env.local (gitignored)
echo "ALLOWED_HOSTS=yourhostname" > .env.local

# Run dev server
bun run dev

# For preview (workaround for Astro bug)
bun run preview -- --allowed-hosts yourhostname
```

See [Astro issue #13060](https://github.com/withastro/astro/issues/13060) for details on the preview allowedHosts bug.
