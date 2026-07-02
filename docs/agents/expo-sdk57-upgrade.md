# Expo SDK 57 升级准备

本文档基于在 `cursor/expo-sdk57-upgrade-prep-e764` 分支上的试升级结果整理，供从 **SDK 55 → SDK 57** 时参考。

## 当前状态 vs 目标

| 项目 | 当前 (main) | 目标 (SDK 57) |
|------|-------------|---------------|
| Expo SDK | 55.0.26 | 57.0.1 |
| React Native | 0.83.6 | 0.86.0 |
| React | 19.2.0 | 19.2.3 |
| TypeScript | 5.9.3 | 6.0.3（可选，见下文） |
| 最低 iOS | 15.1 | **16.4** |
| 最低 Xcode | — | **26.4** |
| Node.js | v22.14.0 ✓ | ≥ 20.19.4 ✓ |

官方建议 **逐版本升级**（55 → 56 → 57）。SDK 57 本身变更较小（RN 0.85 → 0.86，无预期破坏性变更），但跳过 SDK 56 会一次性引入 56 的全部破坏性变更。

参考链接：

- [SDK 56 Changelog](https://expo.dev/changelog/sdk-56)
- [SDK 57 Changelog](https://expo.dev/changelog/sdk-57)
- [升级指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

## 推荐升级路径

### 阶段 0：升级前（在 main 上完成）

1. 将 SDK 55 补丁版本对齐：

   ```bash
   npx expo install --fix
   npx expo-doctor@latest
   ```

2. 确认本地环境：
   - Node.js ≥ 20.19.4
   - Xcode ≥ 26.4（iOS 原生构建）
   - EAS Build 使用 `image: "latest"` 时通常已满足

3. 创建升级分支：

   ```bash
   git checkout -b cursor/expo-sdk57-upgrade-e764
   ```

### 阶段 1：依赖升级

```bash
# 方式 A：直接升到 57（跳过 56，一次性引入所有 56 破坏性变更）
npx expo install expo@^57.0.0 --fix

# 方式 B：更稳妥，逐步升级
npx expo install expo@^56.0.0 --fix
npx expo-doctor@latest
# 修复 56 相关问题后再：
npx expo install expo@^57.0.0 --fix
```

安装剩余 dev 依赖：

```bash
npx expo install eslint-config-expo jest-expo @babel/core --fix
```

### 阶段 2：手动调整的 package.json 项

试升级中确认需要手动处理的项：

| 包 | 当前 | 应升级到 | 说明 |
|----|------|----------|------|
| `@config-plugins/react-native-blob-util` | 13.0.0 | **14.0.1** | 13.x 仅声明 `expo@^55` |
| `@config-plugins/react-native-pdf` | 13.0.0 | **14.0.1** | 同上 |
| `@dev-plugins/react-query` | 0.2.0 | **0.4.0** | 0.2.x 仅声明 `expo@^52` |
| `@dev-plugins/react-navigation` | 0.2.0 | **0.4.0** | 同上 |
| `@react-native/metro-config` | 0.81.x | **0.86.0** | 需与 RN 0.86 对齐 |
| `pnpm.overrides.expo-image-loader` | 55.0.1 | **57.0.0** | 与 SDK 版本一致 |

TypeScript 6.0.3 与当前 `@typescript-eslint/*`（要求 `<6.0.0`）不兼容。在 ESLint 生态跟进前，建议暂时保留 TS 5.9 并加入排除项：

```json
"expo": {
  "install": {
    "exclude": ["typescript"]
  }
}
```

### 阶段 3：app.config.ts 变更

SDK 56 起 `expo-status-bar` 提供 config plugin，CLI 无法自动写入动态配置，需手动添加：

```ts
['expo-status-bar', {}],
```

### 阶段 4：原生项目

项目使用 Continuous Native Generation（无 checked-in `android/` / `ios/`）：

1. 升级后删除本地生成的 `android/`、`ios/`（若存在）
2. 重新 prebuild / EAS Build：

   ```bash
   pnpm prebuild:dev   # 或对应 variant
   ```

3. **必须** 重新构建 development client（`expo-dev-client`）

### 阶段 5：验证

```bash
pnpm install
npx expo-doctor@latest
pnpm typecheck
pnpm lint
pnpm test -- --watchAll=false
```

## 破坏性变更影响分析（本项目）

### 高优先级 — 需要代码迁移

#### 1. Expo Router 与 React Navigation 解耦（SDK 56）

以下文件仍从 `@react-navigation/*` 直接导入，需迁移到 `expo-router/react-navigation` 或评估是否保留独立 React Navigation 依赖：

- `app/_layout.tsx` — `ThemeProvider`, `DarkTheme`, `DefaultTheme`
- `components/ui/alert.tsx` — `useTheme`
- `components/HapticTab.tsx` — `BottomTabBarButtonProps`, `PlatformPressable`
- `hooks/useRefreshOnFocus.ts`, `hooks/useScrollHeader.ts` — `useFocusEffect`
- `features/disable-queries-on-out-of-focus-screens.tsx` — `useIsFocused`
- `lib/theme.ts` — `Theme` 类型

官方提供 codemod 和 [迁移指南](https://expo.dev/blog/expo-router-v56-decoupling-from-react-navigation)。

`package.json` 中仍保留 `@react-navigation/*` 依赖；`expo-doctor` 在 SDK 56+ 会对 `expo-router` + `react-navigation` 共存发出警告。

#### 2. expo-calendar / expo-contacts / expo-media-library 新 API（SDK 56）

旧 API 已弃用，新 OOP API 成为默认导出，旧 API 移至 `/legacy`。

受影响文件（`app/discover/` 演示页为主）：

- `app/discover/calendar.tsx` — `Calendar.*` 类型不存在
- `app/discover/media-library.tsx` — `Album` / `Asset` 类型不兼容
- `app/discover/contacts.tsx`, `app/system-permissions.tsx`, `app/media-viewer.tsx` 等

**迁移选项：**

- 短期：改为 `import * as X from 'expo-media-library/legacy'`（及其他 `/legacy` 路径）
- 长期：迁移到新 OOP API（`Album.getAssets()` 等）

#### 3. expo-navigation-bar API 重构（SDK 56）

`app/discover/navigation-bar.tsx` 使用的 imperative API（`setBackgroundColorAsync`、`NavigationBarBehavior` 等）已移除，需改用组件式 API：

```tsx
import { NavigationBar } from 'expo-navigation-bar';

<NavigationBar style="auto" hidden={false} />
```

#### 4. expo-file-system 异步化（SDK 56）

`File.copy()` / `move()` / `write()` 现为 async。项目中：

- `app/discover/sharing.tsx` — `tempFile.write(...)` 需 `await`
- 已使用 `expo-file-system/legacy` 的文件（如 `file-download.tsx`）暂不受影响

#### 5. `@expo/vector-icons` 不再随 `expo` 捆绑（SDK 56）

项目已在 `package.json` 中显式依赖 `@expo/vector-icons`，无需额外操作。未来计划迁移到 `@react-native-vector-icons/*`。

### 中优先级 — 需验证

| 项 | 说明 |
|----|------|
| `expo/fetch` 成为默认 `globalThis.fetch` | 若有自定义 fetch 行为，可设 `EXPO_PUBLIC_USE_RN_FETCH=1` 回退 |
| Hermes V1 默认启用 | 关注 Android 内存（Reanimated 相关 [已知回归](https://github.com/software-mansion/react-native-reanimated/issues/9650)） |
| iOS 最低版本 16.4 | 放弃 iPhone 7 / 第一代 SE 等设备 |
| `react-native-view-shot` 5.x | 大版本升级，检查截图相关功能 |
| `react-native-worklets` 0.10.x | 与 Reanimated 4.5 配套，验证动画 |
| `expo-three@8.0.0` | peer 依赖严重过时（仅用于 discover 演示？），考虑移除或替换 |

### 低优先级 — pnpm patches

| Patch | SDK 57 状态 | 建议 |
|-------|-------------|------|
| `react-native-css-interop@0.2.3` | 可能仍需要 | 升级后测试 NativeWind 热更新，检查 [nativewind#1773](https://github.com/nativewind/nativewind/issues/1773) |
| `@react-navigation__bottom-tabs@7.15.7` | 需验证 patch 是否仍适用 | 升级 bottom-tabs 后重新评估 |
| `@react-native-segmented-control` | 可能仍需要 | 检查上游是否已修复 `boxShadow` |

## 验证结果

在 `cursor/expo-sdk57-upgrade-prep-e764` 分支上：

- `npx expo install expo@^57.0.0 --fix` — 依赖升级成功
- `npx expo-doctor@latest` — **20/20 通过**
- `pnpm typecheck` — **通过**（已迁移至 SDK 57 新 API）
- `pnpm lint` — 通过（仅有既有 warnings）

### 已完成的代码迁移

- `@react-navigation/*` → `expo-router` 导出
- `expo-calendar` → `getCalendars` / `ExpoCalendar.createEvent` 等 OOP API
- `expo-media-library` → `Album` / `Asset` / `Query` 新 API
- `expo-contacts` → `Contact.getAll` / `Contact.presentPicker`
- `expo-navigation-bar` → 声明式 `<NavigationBar />` 组件
- `expo-file-system` → `File.downloadFileAsync` / `DownloadTask` / `File.upload`

## 升级检查清单

- [x] main 上先对齐 SDK 55 补丁版本（在升级分支直接升至 57）
- [x] 创建升级分支
- [x] 运行 `npx expo install expo@^57.0.0 --fix`
- [x] 更新 config-plugins / dev-plugins / metro-config
- [x] 添加 `expo-status-bar` config plugin
- [x] 更新 `pnpm.overrides.expo-image-loader`
- [x] 迁移 `@react-navigation/*` 导入
- [x] 修复 discover 演示页的 calendar / media-library / navigation-bar API
- [x] 验证 `expo-file-system` 异步调用与新上传/下载 API
- [ ] 重新评估 pnpm patches
- [ ] 删除并重新 prebuild 原生目录
- [ ] 构建新 development client
- [x] 运行 typecheck / lint / test
- [ ] 在真机 / 模拟器上回归核心流程（相机、推送、Stripe、Vision Camera 等）

## 相关命令速查

```bash
# 检查依赖版本
npx expo install --check

# 健康检查
npx expo-doctor@latest

# 清理缓存启动
pnpm expo start -c

# 重新生成原生项目
rm -rf android ios
pnpm prebuild:dev
```
