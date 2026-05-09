# Issues

- Q: Xcode Archive 时 "Build service could not create build operation" 错误
- A: 重启 Xcode 后重试

- Q: Couldn't install Pods, Something went wrong running `pod install`
- A: 尝试手动执行 `npx pod-install`

- Q: Hermes dSYM 缺失
- A: ?

- Q: 执行 `./gradlew app:bundleRelease` 报错 `Invalid token (http status: 401)`
- A: 编辑 `~/.bashrc`, 添加 `export SENTRY_AUTH_TOKEN=<token>` 后执行 `source ~/.bashrc`

- Q: iOS 构建出现 `ignoring duplicate libraries: '-lc++'`
- A: 这是 Xcode 链接阶段发现 `libc++` 被多个 Pod/依赖重复传入后的提示。React Native、Expo、CocoaPods 项目里比较常见，链接器会忽略重复项；只要最终是 `Build Succeeded`，通常不影响 App 运行。

- Q: iOS 构建提示某些 `Run script build phase ... will be run during every build because it does not specify any outputs`
- A: 这是 Xcode 的增量构建提示，意思是脚本没有声明 output files，所以 Xcode 无法判断脚本是否已经是最新状态，会每次构建都执行。Hermes 和 Expo Dev Launcher 相关脚本来自第三方/预构建工程，通常不建议手动修改。

- Q: iOS Debug 构建时 `Upload Debug Symbols to Sentry` 每次都执行
- A: 已通过 `plugins/withSentryDsymUpload.cjs` 限制为仅在 Release 或 CI 构建上传 dSYM。本地 Debug 构建仍会进入 Xcode build phase，但脚本会立即跳过，不再执行实际上传；Release/CI 仍保留 dSYM 上传能力。

- Q: iOS / Expo Go 中 `RefreshControl` 在自定义绝对定位 `ScrollHeader` 页面不显示，或被灵动岛/状态栏/顶部 Header 遮住
- A: 原因是 `ScrollHeader` 使用 `position: 'absolute'` 覆盖在列表上方，而 iOS 下 `RefreshControl` 的原生位置仍从滚动视图顶部开始计算。`progressViewOffset` 在 `FlatList`、`ScrollView`、`FlashList` 以及自定义/动画包装组合中表现不稳定，可能需要反复改成 `headerHeight * 3`、`headerHeight * 4` 才暂时可见。稳定方案是不要依赖 `progressViewOffset`，而是在 iOS 上给滚动容器设置真实顶部 inset：

  ```tsx
  contentInset={Platform.OS === 'ios' ? { top: headerHeight } : undefined}
  contentOffset={Platform.OS === 'ios' ? { x: 0, y: -headerHeight } : undefined}
  scrollIndicatorInsets={Platform.OS === 'ios' ? { top: headerHeight } : undefined}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
  ```

  同时把 iOS 下 `contentContainerStyle.paddingTop` 改为页面自身需要的间距，不再额外叠加 `headerHeight`；Android 仍可保留原来的 `paddingTop: headerHeight + ...`。这样 `RefreshControl` 会从安全区和自定义 Header 下方出现，避免被遮挡。

- Q: EAS iOS App Store production 云端构建失败，日志提示 `Failed to set up credentials`
- A: 失败发生在 `Resolve build configuration` / `EAS_BUILD_INTERNAL` 阶段，还没有进入 Xcode 编译。构建日志关键错误：

  ```text
  Distribution Certificate is not validated for non-interactive builds.
  Failed to set up credentials.
  Credentials are not set up. Run this command again in interactive mode.
  ```

  当前 Apple Developer 账号已过期，生产 App Store 构建需要有效的 iOS distribution certificate / provisioning profile。GitHub App 触发的非交互构建无法在云端交互式修复凭据。待办：续费 Apple Developer 后执行 `npm exec --package eas-cli -- eas credentials -p ios`，修复远程 iOS credentials，再重新触发 production 构建。

- Q: EAS Android Play Store production 云端构建失败，日志提示 `File ./google-services.json doesn't exist`
- A: 失败发生在 `Resolve build configuration` / `EAS_BUILD_INTERNAL` 阶段，还没有进入 Gradle 编译。当前构建被 GitHub App 触发并带有 `--auto-submit-with-profile production`，因此 EAS 在构建前准备 Play Store 自动提交凭据。构建日志关键错误：

  ```text
  File ./google-services.json doesn't exist.
  A Google Service Account JSON key is required to upload your app to Google Play Store.
  Input is required, but stdin is not readable. Failed to display prompt: Path to Google Service Account file:
  ```

  `eas.json` 中 `submit.production.android.serviceAccountKeyPath` 指向 `./google-services.json`，但这里需要的是 Google Play Service Account JSON key，不是 Firebase 的 `google-services.json`。待办：如果暂时只需要构建，关闭 auto-submit 或不要使用 `--auto-submit`；如果需要自动提交，在 EAS Android Credentials 中上传 Google Play Service Account Key，或把 `serviceAccountKeyPath` 改为正确的私密 key 文件路径。

- Q: iOS NativeTabs (`expo-router/unstable-native-tabs`) 下自定义 `ScrollHeader` 顶部出现一截多余间距 (≈ 状态栏高度)
- A: 在 NativeTabs 容器里，iOS 仍会自动给"第一个滚动视图"注入一份顶部 inset (约等于 `safeAreaInsets.top`)，即使在 `<NativeTabs.Trigger>` 上设置 `disableAutomaticContentInsets` 也无法完全关闭(SDK 55 实测：`disableAutomaticContentInsets` 主要只影响底部 Tab bar 那份 inset，顶部 safe area 那份依旧自动注入)。如果手写 `contentInset.top = headerHeight` (= `topInset + 44`)，相当于把 `topInset` 算了两遍，视觉上就会比预期多出一截。

  ```tsx
  // 错误：顶部 inset 被叠加，多出 ~topInset 的空白
  contentInset={Platform.OS === 'ios' ? { top: headerHeight } : undefined}
  contentOffset={Platform.OS === 'ios' ? { x: 0, y: -headerHeight } : undefined}
  scrollIndicatorInsets={Platform.OS === 'ios' ? { top: headerHeight } : undefined}

  // 正确：手写 inset 取一半，让 系统自动注入 + 手写 = headerHeight
  contentInset={Platform.OS === 'ios' ? { top: headerHeight / 2 } : undefined}
  contentOffset={Platform.OS === 'ios' ? { x: 0, y: -headerHeight } : undefined}
  scrollIndicatorInsets={Platform.OS === 'ios' ? { top: headerHeight } : undefined}
  ```

  推导：iOS 视觉上「内容顶端 = 系统自动注入 A + 手写 inset T + contentOffset.y」。要让内容紧贴自定义 Header 底部，需要 `A + T = headerHeight`。系统自动注入 A ≈ `topInset`，所以 T 应该 ≈ `headerHeight - topInset = 44`。在老机型 `topInset = 44`，`headerHeight / 2 = 44` 完全吻合；在灵动岛机型 `topInset = 59`、`headerHeight / 2 ≈ 51`，合计 110，比 headerHeight (103) 略多 ~7px，肉眼几乎看不出来，所以统一用 `headerHeight / 2` 这个简单写法。

  踩过的坑：

  - 不要改成 `contentInsetAdjustmentBehavior="never"` + `automaticallyAdjustContentInsets={false}` 来强行关掉系统注入。这会让 UITabBarController 在 iOS 26 失去对滚动视图的检测，`<NativeTabs minimizeBehavior="onScrollDown">` 不再生效（下滑收起 Tab 失效）。
  - `scrollIndicatorInsets.top` 不参与上面的叠加，保持 `headerHeight` 即可，让滚动条从自定义 Header 下方开始。
  - 后续升级 Expo SDK 时，建议重新验证 NativeTabs 的自动 inset 行为，如果上游修复了 `disableAutomaticContentInsets` 的语义，就可以恢复成 `contentInset.top = headerHeight` 写法。
