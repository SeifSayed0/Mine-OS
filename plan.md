# Personal Life OS Web — Implementation and Design Plan

## Scope

Rebuild Personal Life OS as the real product in the browser first, not as a temporary mockup. The web app is Arabic-first and RTL, works offline for core personal-data features, keeps structured data in IndexedDB, and uses a clean data-access layer so the same application can later be wrapped with Capacitor for Android. Gemini remains optional and must never receive the full local database or a secret embedded in source.

The existing Android project at `/home/ubuntu/personal-life-os` was inspected and remains preserved as a product-reference implementation. The new web project is independent so the existing Room data and APK artifacts are not changed or lost.

## Architecture

- `src/app`: application shell, navigation state, theme and global feedback.
- `src/domain`: typed entities, enums, validation, derived metrics and use-case helpers.
- `src/data`: IndexedDB schema, migrations, repositories and backup/restore serialization.
- `src/features`: focused screen modules for Today, Inbox, Projects, People, Library, Review and Assistant.
- `src/components`: reusable visual primitives only where they express the design system, not generic card wrappers everywhere.
- `src/styles`: tokens, light/dark themes, typography, motion and responsive rules.
- `tests`: browser-facing Playwright tests for core flows and data persistence.
- `public/manus-routes.json`: complete route manifest for the application.

IndexedDB is the only required persistence layer. Every core mutation goes through repositories and updates visible UI state. Backup/restore uses explicit merge or replace mode with schema validation. Browser notification support is feature-detected; unsupported or denied permissions produce clear in-app feedback.

## Design direction

Three possible movements considered:

1. **Quiet command center** — 0.06 probability: a calm editorial workspace with one strong focus rail and restrained utility surfaces.
2. **Soft field notes** — 0.04 probability: a warmer notebook-like system with paper cues and gentle grouping.
3. **Linear dusk** — 0.03 probability: a darker, sharper command surface with compact rows and high information density.

Chosen: **Quiet command center**.

- **Design Movement:** premium minimalist editorial productivity interface, informed by the hierarchy and restraint of Things 3, TickTick, Sunsama and Linear without copying them.
- **Core Principles:** one clear next action; calm density; contextual detail instead of dashboard noise; every control has a visible consequence.
- **Color Philosophy:** warm paper and ink for light mode, deep ink and muted mineral surfaces for dark mode, with an ownable “signal teal” used only for focus, progress and primary action.
- **Layout Paradigm:** an asymmetric two-zone shell on desktop (quiet navigation rail plus focus workspace) that collapses into a compact bottom action bar on mobile; screens are organized as timelines, lists and reading surfaces rather than grids of cards.
- **Signature Elements:** a vertical signal line for focus items, a slim context rail for project/person relationships, and editorial section labels with generous whitespace.
- **Interaction Philosophy:** progressive disclosure; quick capture first, details on demand; destructive actions are explicit; completion feels quiet rather than celebratory.
- **Animation:** 150–220ms opacity/translate transitions for route and panel changes, no looping decoration, reduced-motion support, and subtle list insertion/removal cues.
- **Typography System:** system Arabic sans fallback with clear weight contrast; large editorial titles, compact section labels, 16px minimum body text, and tabular numerals only for metrics.
- **Brand Essence:** a private operating layer for real life, helping a person decide what deserves attention without turning life into a score; calm, precise, humane.
- **Brand Voice:** direct, warm and non-judgmental. Examples: “ما الخطوة التي تستحق انتباهك الآن؟” and “اترك الباقي مفتوحًا بدون لوم.”
- **Wordmark & Logo:** a small signal-mark made from a single vertical line meeting a soft horizon stroke, paired with a restrained wordmark.
- **Signature Brand Color:** Signal Teal `#2D8C87`, reserved for active focus and meaningful progress.

## Implementation phases

1. Establish Vite/React/TypeScript toolchain, tokens, shell, route manifest and IndexedDB repositories.
2. Build the primary experience: Today/home focus, quick capture, task editing and inbox conversion.
3. Add Projects, People/Commitments, Library, Search, Review and Progress as purpose-built screens.
4. Add backup/restore, theme persistence, browser notifications and optional Gemini boundary.
5. Add Playwright coverage, run typecheck/build/browser tests, inspect responsive Preview screenshots, and fix confirmed issues.
6. Add Capacitor configuration only after web behavior is stable; preserve the same `dist` output and document Android build requirements.

## Out of scope unless explicitly requested later

- Mandatory backend or remote database.
- Firebase.
- Automatic conversion of every thought into a task.
- Paid Gemini billing or any secret committed to the repository.
