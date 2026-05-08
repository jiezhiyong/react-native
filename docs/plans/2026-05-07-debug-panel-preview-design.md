# Debug Panel Preview 设计

日期：2026-05-07

## 背景

当前仓库已经有 `debug-panel/`，使用 `@gorhom/bottom-sheet` 实现了部分业务调试面板能力，包括 API 环境切换、请求加解密开关、AsyncStorage 查看、App 信息展示等。根布局通过 `APP_VARIANT` 控制是否挂载调试面板。

需要新增一个更接近发布版本更新行为的 Preview 内部分发包，用于测试 Expo OTA / EAS Update。Development Build 默认依赖本地 Metro 动态加载 JavaScript，不适合作为验证发布更新行为的主路径。

相关 Expo 文档：

- https://docs.expo.dev/develop/development-builds/introduction/
- https://docs.expo.dev/eas-update/debug/
- https://docs.expo.dev/versions/v55.0.0/sdk/dev-menu/
- https://docs.expo.dev/versions/latest/sdk/updates/

## 目标

- `preview` 包表现为 release-like internal distribution，使用内置 JS bundle 和 `preview` channel 测试 OTA。
- `preview` 包默认对所有安装者开放业务调试面板。
- `preview` 包支持类似 Expo dev menu 的隐藏入口：摇晃打开、三指长按打开。
- `development` 保留 Expo dev menu 原生触发行为，摇晃 / 三指长按只打开 dev menu。
- `development` 中业务 DebugPanel 只能通过额外注册的 dev menu item 打开。
- `production` 尽量完全不包含 DebugPanel UI、触发器、dev menu 注册代码。
- Debug settings 作为业务 service 可读取的轻量层存在，不与 DebugPanel UI 强绑定。

## 非目标

- 不把 `expo-dev-menu` 当成完整业务调试面板容器。
- 不在 `preview` 中依赖 `expo-dev-client` 或 `expo-dev-menu`。
- 不把 native Debug updates 作为团队日常 Preview 分发主路径。
- 第一版不追求所有调试开关都热更新生效。

## 变体策略

| 变体 | 构建定位 | DebugPanel | 触发入口 | OTA 行为 |
| --- | --- | --- | --- | --- |
| `development` | Development Build | 可用 | Expo dev menu item | 依赖 Metro，不作为 OTA 主验证 |
| `preview` | Release-like internal distribution | 默认可用 | 自定义摇晃 + 三指长按 | 使用 `preview` channel 测试 EAS Update |
| `preview_debug_updates` | Debug 配置排障包 | 可用 | 可按开发者需要配置 | `EX_UPDATES_NATIVE_DEBUG=1`，只用于 updates 原生加载排障 |
| `production` | 正式发布 | 不可用 | 无 | 使用 `production` channel |

`preview` 应调整为 `developmentClient: false`、`distribution: internal`、`channel: preview`、`APP_VARIANT=preview`。`preview_debug_updates` 单独保留给开发者排查 updates 原生层问题，不作为 QA / 产品日常分发包。

## expo-dev-menu 使用边界

SDK 55 的 `expo-dev-menu` 公开扩展能力是注册菜单项：`registerDevMenuItems(items)`。菜单项包含 `name`、`callback`、`shouldCollapse`，适合添加入口，不适合自由渲染复杂二级业务面板。

因此：

- `development` 中注册一个 `Open Debug Panel` dev menu item，点击后打开自定义 DebugPanel。
- `development` 中摇晃 / 三指长按仍由 expo-dev-client 原生能力处理，只打开 dev menu。
- `preview` 不 import `expo-dev-menu`，也不依赖其触发能力。
- `production` 不 import dev menu 注册入口。

## 模块结构

建议拆分为以下层次：

```text
debug-panel/
  index.ts
  noop.tsx
  components/
  hooks/
  runtime/
    DebugPanelHost.tsx
    DebugPanelHost.noop.tsx
  triggers/
    PreviewDebugPanelTriggers.tsx
  dev-menu/
    register.ts
    noop.ts

lib/
  debug-settings/
    index.ts
    storage.ts
    store.ts
    types.ts
```

职责划分：

- `debug-panel/components/` 只负责面板 UI。
- `debug-panel/triggers/` 只负责 Preview 的摇晃和三指长按。
- `debug-panel/dev-menu/` 只负责 Development 的 dev menu item 注册。
- `debug-panel/runtime/DebugPanelHost` 作为根布局挂载入口，按变体组合 UI、触发器、dev menu 注册。
- `lib/debug-settings/` 作为业务 service 可读取的调试配置层，不能依赖 DebugPanel UI。

## Production 裁剪

当前根布局静态 import `@/debug-panel`，即使运行时不显示，也可能让生产 bundle 包含 DebugPanel 及其依赖。应增加 Metro 解析分流：

- production 构建时，DebugPanel host 解析到 noop。
- production 构建时，dev menu 注册入口解析到 noop。
- development / preview 才解析到真实 DebugPanel host。
- runtime 的 `showDebugPanel` 仍可保留为保险，但不再作为生产隔离的唯一手段。

目标是让 production 不包含 `@gorhom/bottom-sheet` 面板代码、业务调试动作、dev menu 注册逻辑。

## Preview 触发器

Preview 自定义触发器提供两种入口。

### 摇晃打开

- 使用已有 `expo-sensors` 的 `Accelerometer`。
- 只在 AppState 为 `active` 时监听。
- Web 也启用。部分调试功能 Web 端可用，同时 Web 端入口便于调试 DebugPanel UI。
- 面板已打开时忽略。
- 触发后只执行 `setVisible(true)`，不做 toggle。
- 摇晃灵敏度与 Expo dev menu 保持一致。Native 端优先复用或移植 Expo dev menu 的 shake detector 规则；Android 当前规则为单轴 force 超过 `SensorManager.GRAVITY_EARTH * 1.33f`、累计至少 3 次方向变化后触发，并使用 600ms 派发间隔。iOS 侧对齐 React Native / Expo dev menu 的 shake 触发语义。
- Web 端在浏览器 `DeviceMotionEvent` / `Accelerometer` 能力允许范围内按同一语义近似实现；若浏览器需要权限或不支持传感器，则保持入口不可用但不影响其它调试功能。

### 三指长按打开

- 使用已有 `react-native-gesture-handler`。
- 手势语义为三指长按，不使用三指轻点。
- 放在根内容区域触发，但不刻意覆盖所有最顶层 UI。
- 不抢系统弹窗、输入法、已有 BottomSheet、DebugPanel 自身等顶层交互。
- 面板已打开时忽略。
- 触发后只执行 `setVisible(true)`。

## Debug Settings

调试配置应进入 `lib/debug-settings/`，作为业务 service 可读取的轻量层，而不是放在 `debug-panel/` 里。

建议统一存储 key，例如 `@debug-panel/settings`。内部结构化保存：

- `apiEnv`
- `requestEncryptionEnabled`
- `abFlags`
- `featureFlags`

规则：

- API 环境切换写入后要求 reload 生效。
- 请求加解密开关允许立即生效，因为 service 每次读取 Storage 判断是否加解密。
- Feature Flag / AB 默认 reload 后生效。
- 明确标记为 `runtime` 的 flag 可以立即生效。
- production 中 debug settings 读取层返回安全默认值，忽略 preview/development 调试覆盖。

## AsyncStorage 清理

清理能力分级，不提供单一无差别入口：

- 清除业务缓存
- 清除登录态
- 清除全部

第一版使用可配置 scope / allowlist：

```text
debug-panel/config/storageScopes.ts
```

每个 scope 定义：

- `id`
- `label`
- `description`
- `matchKey(key)`

行为：

- 清理前展示将删除的 key 数量。
- 清理后刷新 key 列表。
- Debug Settings 自己的 key 默认只在“清除全部”里删除。
- “清除登录态”和“清除全部”需要二次确认。

## Reload 规则

- API 环境切换：reload 后生效。
- 请求加解密：立即生效。
- AB / Feature Flag：默认 reload 后生效，`runtime` flag 立即生效。
- DebugPanel 面板自身开关、展开关闭状态：立即生效，不持久化为业务状态。

## 实施顺序

1. 新增 `lib/debug-settings/`，收口配置类型、默认值、Storage 读写。
2. 拆分 `debug-panel/runtime/`、`debug-panel/triggers/`、`debug-panel/dev-menu/`。
3. 移除右下角悬浮 debug 图标。
4. Development 注册 dev menu item，点击后打开 DebugPanel。
5. Preview 实现摇晃和三指长按触发器。
6. 增加 Metro 解析分流，production 指向 noop。
7. 调整 `eas.json`：`preview` 改为 release-like internal distribution，新增 `preview_debug_updates`。
8. 将现有 API 环境、请求加密、AsyncStorage 清理改接入 `lib/debug-settings/` 和 storage scopes。
9. 做 targeted 验证。

## 验证计划

- TypeScript：`pnpm typecheck`
- Lint：针对 `debug-panel/`、`lib/debug-settings/`、`app/_layout.tsx` 做定向 lint。
- Development：
  - 摇晃 / 三指长按打开 Expo dev menu。
  - dev menu item 打开 DebugPanel。
  - 右下角悬浮图标不存在。
- Preview：
  - 安装内部分发包后无需 Metro。
  - `Updates.channel` 对应 `preview`。
  - 摇晃打开 DebugPanel。
  - 三指长按打开 DebugPanel。
  - 面板已打开时重复触发不会关闭面板。
- Production：
  - 无 DebugPanel 入口。
  - 无 dev menu item 注册。
  - bundle 中不应解析真实 DebugPanel host。
