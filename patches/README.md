# Patches

This directory contains pnpm patches that are applied during dependency installation.

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
