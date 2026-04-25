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
