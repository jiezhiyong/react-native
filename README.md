# Expo React Native APP 👋

This is an [Expo](https://expo.dev) project template. doc: [Expo documentation](https://docs.expo.dev)

## 初始化 & 本地开发

```bash
pnpm install # 安装依赖
pnpm run:dev --clear # 启动开发模式 (可选清除 bundler 缓存)
```

## 创建本地开发版本 Development Build（依赖 Development servers）

```sh
npx expo install expo-dev-client # 安装开发客户端
```

```sh
pnpm prebuild:dev -p <android | ios> # 使用 Prebuild 生成原生 Android 和 iOS 目录
```

```sh
pnpm run:ios:simulator
pnpm run:ios:device
pnpm run:android
```

## 生成安卓打包密钥

```sh
keytool -genkeypair -v -storetype PKCS12 -keystore keystores/release.keystore -alias qachat-release -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=com.jiezhiyong.qachat,OU=,O=,L=Shanghai,S=Shanghai,C=CN"
```

## 创建生产版本

- [ios](https://reactnative.dev/docs/publishing-to-app-store)

```sh
1. pnpm prebuild:prod -p ios
2. open ios/ChatQA.xcworkspace
3. Xcode - Configure release scheme: Product -> Scheme -> Edit Scheme -> Run tab: Info - Build Configuration -> 选择 Release
4. Xcode - Archive: 选择 Any iOS Device (arm64) -> Product -> Archive
```

- [android](https://reactnative.dev/docs/signed-apk-android)

```sh
1. pnpm prebuild:prod -p android
2. cd android && ./gradlew app:assembleRelease # 生成发布 APK
```

## 部署 WEB 应用

```sh
npx expo export -p web
npx expo serve # 在本地启动服务进行测试
```

```sh
EXPO_UNSTABLE_ATLAS=true npx expo start # 使用 Atlas 分析包大小
EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev # 将开发模式更改为生产模式
EXPO_UNSTABLE_ATLAS=true npx expo export & npx expo-atlas .expo/atlas.jsonl # 使用 Atlas 与 npx expo export 结合
```

### 添加插件

```sh
npx expo install <plugin-name>
```

### 添加 shadcn/ui 组件

```sh
npx @react-native-reusables/cli@latest add
```

### 重要组件 & 工具

- [Expo SDK](https://docs.expo.dev/versions/latest/sdk/expo)
- [react-native-reusables](https://rnr-docs.vercel.app)
- [React Native Vision Camera](https://react-native-vision-camera.com)
- [keyboard](https://kirillzyusko.github.io/react-native-keyboard-controller)
- [tanstack-query](https://tanstack.com/query/v4)
- [react-hook-form](https://react-hook-form.com)
- [react-native-bottom-sheet](https://gorhom.dev/react-native-bottom-sheet)
- [flash-list](https://shopify.github.io/flash-list)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler)
- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)
- [react-native-safe-area-context](https://appandflow.github.io/react-native-safe-area-context)
- [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info)
- [react-native-modal](https://github.com/react-native-modal/react-native-modal)
- [react-navigation](https://reactnavigation.org)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [async-storage](https://react-native-async-storage.github.io/async-storage/docs/usage/)
- [fbflipper](https://fbflipper.com)
- [react-native-app-link](https://github.com/FiberJW/react-native-app-link)
- [uri-scheme](https://github.com/expo/expo/tree/main/packages/uri-scheme#readme)
- [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n)
- [sentry](https://docs.sentry.io/platforms/react-native)
- [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
- [react-native-edge-to-edge](https://github.com/zoontek/react-native-edge-to-edge)
- [...](https://reactnative.directory)

## 参考文档

- [Expo Go](https://expo.dev/go)
- [调试](https://docs.expo.dev/debugging/errors-and-warnings)
- [权限](https://docs.expo.dev/guides/permissions)
- [单元测试](https://docs.expo.dev/develop/unit-testing)
- [E2E](https://docs.expo.dev/build-reference/e2e-tests)
- [存储数据](https://docs.expo.dev/develop/user-interface/store-data)
- [使用 VS Code 进行调试](https://docs.expo.dev/debugging/tools/#debugging-with-vs-code)
- [Snack](https://snack.expo.dev)
- [使用 app config 配置](https://docs.expo.dev/workflow/configuration)
- [链接](https://docs.expo.dev/linking/overview)
- [自定义本机代码](https://docs.expo.dev/workflow/customizing)
- [PWA](https://docs.expo.dev/guides/progressive-web-apps)
- [分析 JavaScript 包](https://docs.expo.dev/guides/analyzing-bundles)
- [树摇](https://docs.expo.dev/guides/tree-shaking)
- [压缩 JavaScript](https://docs.expo.dev/guides/minify)
- [Expo Modules API](https://docs.expo.dev/modules/overview)
- [Expo 推送通知](https://docs.expo.dev/push-notifications/overview)
- [应用签名](https://docs.expo.dev/app-signing/app-credentials/#distribution-certificate)
- [本地优先](https://docs.expo.dev/guides/local-first)
- [React Native 分析 SDK 和库](https://docs.expo.dev/guides/using-analytics、https://rnfirebase.io)
- [使用内购](https://docs.expo.dev/guides/in-app-purchases)
- [Exmple](https://github.com/expo/examples)
- [Follow Up](https://docs.expo.dev/tutorial/follow-up/)
- [Additional Resources](https://docs.expo.dev/additional-resources/)
- [OTA](https://github.com/vantuan88291/react-native-ota-hot-update、 https://github.com/gronxb/hot-updater)
- [Expo 配置插件](https://github.com/expo/config-plugins)

## TODO: 创建内部分发用 DEBUG 版本

```sh
1. pnpm prebuild:test -p ios
2. open ios/ChatQA.xcworkspace
3. Xcode - Configure release scheme: Product -> Scheme -> Edit Scheme -> Run tab: Info - Build Configuration -> 选择 Debug
4. Xcode - Archive: 选择 Any iOS Device (arm64) -> Product -> Archive
5. 选择 Archive -> Debugging -> Export -> 导出 .ipa 文件
```

```sh
1. pnpm prebuild:test -p android
2. cd android && ./gradlew app:assembleDebug
```

## 其他

```sh
npx expo install expo@latest # 升级 Expo SDK
npx expo install --fix # 将所有依赖升级以匹配已安装的 SDK 版本
npx setup-safari # 自动将捆绑标识符注册到 Apple 帐户，为 ID 分配权限，并在商店中创建 iTunes 应用条目
```

```sh
npx expo install --check # 检查依赖
npx expo-doctor@latest # 检查配置
npx react-compiler-healthcheck@latest # 检查项目与 React 编译器的兼容性
```

## TODO: 构建具有与发布构建相同更新行为的调试版本

- https://docs.expo.dev/versions/latest/sdk/updates/#testing
- https://docs.expo.dev/debugging/runtime-issues/#native-debugging

```sh
1. export EX_UPDATES_NATIVE_DEBUG=1
2. pnpm prebuild:dev

# Android Studio
3. open -a "/Applications/Android Studio.app" ./android
4. 等待项目同步完成（右下角进度条消失）
5. 选择设备，构建应用 (Control + R)

# Xcode
3. npx pod-install
4. sed -i '' 's/SKIP_BUNDLING/FORCE_BUNDLING/g;' ios/ChatQA.xcodeproj/project.pbxproj
5. xed ios
6. 选择设备，构建应用 (Command + R)

7. unset EX_UPDATES_NATIVE_DEBUG
8. sed -i '' 's/FORCE_BUNDLING/SKIP_BUNDLING/g' ios/ChatQA.xcodeproj/project.pbxproj # 恢复 SKIP_BUNDLING 变更
```

## TODO

```sh
# android
npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# ios
npx react-native bundle --platform ios --dev true --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios
```

## TODO: 待办事项

- PDF预览器
- Webview sdk: 回退携带数据、ntv_new ...
- 包含调试面板，但不包含 dev-client 的 Test 变体包
- 网络请求封装
- Sentry
- 网络加解密封装
- i18n
- theme
- 应用宝
- 地图
- 人脸识别
- 友盟？消息推送？
- ios 设备上安装 Test 变体报错
