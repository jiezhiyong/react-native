# Patches

This directory contains pnpm patches that are applied during dependency installation.

Patches are registered in `package.json` under `pnpm.patchedDependencies`.
The corresponding patch hashes are recorded in `pnpm-lock.yaml`.

## `react-native-css-interop@0.2.3.patch`

### Background

Expo SDK 55 / React Native 0.83 uses Metro 0.83+, whose `DependencyGraph._onHasteChange` expects file watcher change events in the newer `changes` format:

```js
{
  changes: {
    addedDirectories,
    removedDirectories,
    addedFiles,
    modifiedFiles,
    removedFiles,
  },
  rootDir,
}
```

`react-native-css-interop@0.2.3`, which is pulled in by `nativewind@4.2.3`, still emits NativeWind hot-update events in the older `eventsQueue` format. When a file edit causes NativeWind to regenerate styles, Metro receives an event without `changes`, then crashes with:

```text
TypeError: Cannot read properties of undefined (reading 'addedFiles')
    at DependencyGraph._onHasteChange (.../node_modules/metro/src/node-haste/DependencyGraph.js:99:18)
    at Object.onChange (.../node_modules/react-native-css-interop/src/metro/index.ts:344:15)
```

### Fix

The patch updates `react-native-css-interop` to emit the Metro 0.83-compatible `changes` event shape for its virtual CSS module updates.

This patches the source of the incompatible event instead of making Metro tolerate invalid input.

### Upstream Tracking

- GitHub issue: https://github.com/nativewind/nativewind/issues/1773

### Removal Criteria

Remove this patch when upgrading to a NativeWind / `react-native-css-interop` version that emits Metro 0.83-compatible change events upstream.

After removing the patch, verify by running the dev server and editing a file that changes a NativeWind class name. Metro should hot reload without throwing the `addedFiles` error.

## `@react-native-segmented-control__segmented-control@2.5.7.patch`

### Background

`@react-native-segmented-control/segmented-control@2.5.7` defines the web slider shadow with deprecated React Native Web style props:

```js
shadowColor
shadowOffset
shadowOpacity
shadowRadius
```

React Native Web warns in development when these props are preprocessed:

```text
"shadow*" style props are deprecated. Use "boxShadow".
```

`LogBox.ignoreLogs` does not suppress this on web because React Native Web's `LogBox` export is a no-op and the warning is emitted directly through `console.warn`.

### Fix

The patch replaces the deprecated `shadow*` style props with the equivalent `boxShadow` value:

```js
boxShadow: '0px 1px 2.22px rgba(0, 0, 0, 0.22)'
```

The existing `elevation` value is left intact for native Android behavior.

### Removal Criteria

Remove this patch when upgrading to a version of `@react-native-segmented-control/segmented-control` that uses `boxShadow` or otherwise no longer emits the React Native Web `shadow*` deprecation warning.

After removing the patch, verify the Expo web dev server with a clean Metro cache:

```sh
pnpm expo start -c
```

## `@react-navigation__bottom-tabs@7.15.7.patch`

### Background

`@react-navigation/bottom-tabs@7.15.7` still passes `pointerEvents` as a React Native prop in `BottomTabBar`:

```tsx
<Animated.View pointerEvents={isTabBarHidden ? 'none' : 'auto'} />
<View pointerEvents="none" />
```

React Native Web 0.21 warns in development:

```text
props.pointerEvents is deprecated. Use style.pointerEvents
```

The stack points at `BottomTabBar.js` after app-level `pointerEvents` props have already been moved into styles.

### Fix

The patch moves the tab bar and background pointer event values into `style.pointerEvents`, preserving the same runtime behavior.

### Removal Criteria

Remove this patch when upgrading to a version of `@react-navigation/bottom-tabs` that no longer passes `pointerEvents` as a prop.

After removing the patch, verify the Expo web dev server with a clean Metro cache:

```sh
pnpm expo start -c
```
