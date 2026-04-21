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

## Expo Official LLM Docs

Use Expo's official LLM docs as the first external reference for framework guidance:

- General Expo, Router, workflow, config plugins, native modules, debugging:
  `https://docs.expo.dev/llms-full.txt`
- EAS build, submit, update, credentials, workflows:
  `https://docs.expo.dev/llms-eas.txt`
- SDK API reference and module usage:
  `https://docs.expo.dev/llms-sdk.txt`

How to use them:

1. Prefer `llms-sdk.txt` when answering API usage questions about a specific Expo module.
2. Prefer `llms-eas.txt` for build, submit, credentials, update, or CI/CD questions.
3. Prefer `llms-full.txt` for broader Expo workflow, Router, config plugin, or project structure guidance.
4. Do not paste entire upstream sections into repo docs. Summarize only the parts that affect this codebase.
5. If Expo docs conflict with checked-in code, explain the conflict and follow the repository's current implementation unless the task is explicitly an upgrade.

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
pnpm test
pnpm test:e2e
pnpm format
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
- `lib/`: helpers, constants, utilities
- `store/`: Zustand stores
- `hooks/`: custom hooks
- `assets/`: images, fonts, and static assets
- `plugins/`: local Expo config plugins
- `e2e/`: Maestro E2E tests

### Repo-Specific Patterns

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
