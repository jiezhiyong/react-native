# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Snapshot

- App name: ChatQA
- Stack: Expo SDK 55, React Native 0.83, React 19, Expo Router, TypeScript, NativeWind 4, Zustand, TanStack Query
- Platforms: iOS, Android, Web
- Package manager: pnpm
- App variants: `development`, `test`, `production`
- New Architecture: enabled in `app.config.ts`
- React Compiler: enabled in `app.config.ts`

## Source Of Truth

When local docs and code disagree, trust the repository code first.

- Dependencies and versions: `package.json`
- Expo app configuration: `app.config.ts`
- Metro configuration: `metro.config.cjs`
- Project usage notes: `README.md`
- EAS-specific notes: `README - EAS.md`

## External Docs (Fetch On Demand Only)

**Do not pre-fetch these URLs.** Only fetch when checked-in code and training data cannot resolve the question — for example, an ambiguous API signature, an SDK 55-specific behavior, or an unfamiliar config plugin option.

### When and What to Fetch

| Trigger                                               | Fetch URL                                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Expo module API unclear (params, return type, events) | `https://docs.expo.dev/llms-sdk.txt`                                               |
| EAS build / submit / update / credentials question    | `https://docs.expo.dev/llms-eas.txt`                                               |
| Expo Router, config plugins, native modules, workflow | `https://docs.expo.dev/llms.txt` (index) → then the specific page URL listed there |
| React Native core API unclear                         | `https://reactnative.dev/llms.txt` (index) → then the specific page URL            |

### Fetch Strategy

1. **Fetch the index first** (`llms.txt`) — it is small and lists individual page URLs.
2. **Fetch only the one relevant page** from the index instead of the full doc.
3. **Avoid fetching full aggregated docs** (`llms-full.txt`, `llms-sdk.txt`) unless the task spans multiple modules with no other resolution path.
4. If upstream docs conflict with checked-in code, explain the conflict and follow the repository's current implementation unless the task is explicitly an upgrade.

## Core Commands

### Development

```bash
pnpm install
pnpm start:dev
pnpm start:test
pnpm start:prod
pnpm run:android
pnpm run:ios:simulator
pnpm run:ios:device
```

### Prebuild And Native Runs

```bash
pnpm prebuild:dev
pnpm prebuild:test
pnpm prebuild
pnpm build:android:debug
pnpm build:ios:debug
```

### Quality

```bash
pnpm lint
pnpm typecheck
pnpm test                    # Interactive watch mode (local development)
pnpm test -- --watchAll=false  # Non-interactive mode (CI / agent runs)
pnpm test:e2e
pnpm test:e2e:single <path>  # Run a single Maestro test file
pnpm format
pnpm generate-i18n
```

### Analysis

```bash
pnpm analyze:web
pnpm analyze:ios
pnpm analyze:android
```

## Architecture Notes

### Directory Layout

- `app/`: Expo Router routes, including tab routes, protected routes, and feature screens
- `components/`: reusable UI components and primitives
- `constants/`: shared constants (for example `Colors.ts`)
- `lib/`: helpers, constants, utilities
- `store/`: Zustand stores
- `hooks/`: custom hooks
- `assets/`: images, fonts, and static assets
- `i18n/`: typesafe-i18n locale files and generated typing utilities
- `modules/`: local Expo native modules (for example `my-module`)
- `debug-panel/`: debug-only panel module with its own components and hooks
- `plugins/`: local Expo config plugins
- `e2e/`: Maestro E2E tests

### Repo-Specific Patterns

- `i18n/` uses typesafe-i18n; after changing locale files, run `pnpm generate-i18n`.
- `modules/my-module` is a local Expo native module; changes there may require `pnpm prebuild[:variant]`.
- Routing is file-based through Expo Router under `app/`.
- App behavior changes by `APP_VARIANT`.
- Native configuration is driven by `app.config.ts`, not a checked-in `app.json`.
- The project uses both `expo-camera` and `react-native-vision-camera`; do not replace one with the other without checking the target screen.
- Media-related work may involve `expo-image`, `expo-video`, `expo-image-picker`, and `expo-media-library`.
- Server state uses TanStack Query.
- Local persisted state uses Zustand plus secure storage patterns.

## Working Rules

### Dependency And Expo Changes

- Use `npx expo install <package>` for Expo-compatible dependency changes.
- If changing SDK-sensitive packages, verify compatibility with Expo SDK 55.
- If changing config plugins, permissions, bundle identifiers, associated domains, or native capabilities, inspect `app.config.ts`.
- If a change affects generated native projects, note whether `pnpm prebuild[:variant]` should be rerun.
- Do not edit generated native files unless the task explicitly requires native changes and the generated output is intended to be checked in.

### Patches, Plugins, And Special-Case Logic

- When adding or changing `patches/`, local Expo config plugins in `plugins/`, or code paths introduced for special-case behavior, document the background in the same change: why the workaround/plugin exists, what upstream or platform behavior it addresses, and when it can be removed or revisited.
- Include a follow-up plan for these changes, such as verification steps, cleanup conditions, upstream issue tracking, or migration notes after dependency/SDK upgrades.
- Avoid adding opaque workaround code without nearby comments or repository documentation that future agents can use to understand the intent.

### Variants

`APP_VARIANT` controls bundle identifiers, app name, and debug behavior:

- `development`: dev bundle ID and debug-friendly behavior
- `test`: internal testing variant
- `production`: release behavior

Be careful not to hardcode environment-specific values that bypass this variant system.

### When Editing Features

1. Prefer route files in `app/` for new screens.
2. Put reusable UI in `components/`.
3. Add shared logic to `hooks/`, `lib/`, or `store/` instead of duplicating it in route files.
4. Keep TypeScript strict and avoid introducing `any` without a strong reason.
5. Preserve existing styling patterns with NativeWind and the current design system.
6. For NativeWind spacing on native UI, do not use `space-x-*` or `space-y-*`; use `gap-*` when supported, or explicit child margins such as `mt-*` / `ml-*`.

### Testing Expectations

- Run `pnpm typecheck` after non-trivial TypeScript changes.
- Run `pnpm lint` when touching JS/TS files broadly.
- Run targeted tests or `pnpm test:e2e` when changing flows covered by Maestro.
- If you cannot run verification, say so clearly.

## Important Files

- `app.config.ts`: variant-aware Expo config, plugins, permissions, updates, platform settings
- `package.json`: scripts, dependency versions, test config
- `metro.config.cjs`: Metro setup
- `babel.config.js`: Babel setup
- `tailwind.config.js`: Tailwind config
- `global.css`: shared styling tokens

## Practical Reminders For Agents

- Before suggesting Expo changes, check whether the repo already has a local convention in `README.md` or `README - EAS.md`.
- Prefer concise summaries of Expo docs over copying upstream guidance.
- Keep this file focused on how this repository works, not on generic Expo onboarding.
