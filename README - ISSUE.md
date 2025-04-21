# issue

- Q: Xcode Archive 时 "Build service could not create build operation" 错误
- A: 重启 Xcode 后重试

- Q: Couldn't install Pods, Something went wrong running `pod install`
- A: 尝试手动执行 `npx pod-install`

- Q: Hermes dSYM 缺失
- A: ?

- Q: 执行 `./gradlew app:bundleRelease` 报错 `Invalid token (http status: 401)`
- A: 编辑 `~/.bashrc`, 添加 `export SENTRY_AUTH_TOKEN=<token>` 后执行 `source ~/.bashrc`
