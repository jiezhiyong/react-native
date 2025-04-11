# Expo app with EAS 👋

This is an [Expo](https://expo.dev) project template. doc: [Expo documentation](https://docs.expo.dev)

- [使用 EAS: 工作流、构建、托管、发布、更新、元数据、分析、分发](https://docs.expo.dev/eas)
- [使用 Sentry:错误追踪](https://docs.sentry.io/platforms/react-native)

## Get started

```bash
pnpm install # 安装依赖
npx expo start # 启动开发模式
npx expo start --no-dev --minify # 启动生产模式
npx expo start --clear # 清除 bundler 缓存
```

## 添加插件

```sh
npx expo install <plugin-name>
```

## 添加通用组件

```sh
npx @react-native-reusables/cli@latest add
```

## Expo SDK

- [expo-router](https://docs.expo.dev/router/introduction)
- [expo-auth-session](https://docs.expo.dev/versions/latest/sdk/auth-session)
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore)
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite)
- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera)
- [expo-network](https://docs.expo.dev/versions/latest/sdk/network)

## 重要组件 & 工具

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
- [...](https://reactnative.directory)

## 创建开发版本

```sh
npx expo install expo-dev-client
```

### 预构建

```sh
npx expo prebuild --clean # 使用 Prebuild 生成原生 Android 和 iOS 目录
npx expo prebuild --clean -p android
npx expo prebuild --clean -p ios
```

### 配置证书

```sh
eas credentials
```

### 创建开发版本 - 本地构建

```sh
npx expo run:android
npx expo run:ios # simulator, eas.json => build.development.ios.simulator: true
npx expo run:ios --device # eas.json => build.development.ios.simulator: false
```

### 创建开发版本 - 在 EAS 上构建 / 使用 EAS CLI 本地构建 (--local)

```sh
npm install -g eas-cli
eas build -p all --profile development
eas build -p android --profile development
eas build -p ios --profile development
```

## 创建生产构建 - 在 EAS 上构建 / 使用 EAS CLI 本地构建 (--local)

```sh
eas build -p all --profile production
eas build -p android --profile production
eas build -p ios --profile production
```

### 提交构建

```sh
eas submit -p android
eas submit -p ios
```

### 提交 ios 商店元数据

```sh
eas metadata:push
```

### 发送无线更新

```sh
eas update --environment production | preview | development
npx sentry-expo-upload-sourcemaps dist

eas update --auto
eas update:configure
eas update --channel production
```

### 部署 WEB 应用

```sh
npx expo export -p web
npx expo serve # 在本地进行测试
eas deploy
eas deploy --prod
```

## 检查配置 https://docs.expo.dev/develop/tools/#expo-doctor

```sh
npx expo install --check # 检查依赖
npx expo-doctor # 检查配置
npx react-compiler-healthcheck@latest # 检查项目与 React 编译器的兼容性
```

## Orbit

```sh
brew install expo-orbit
```

## 其他

```sh
npx expo install expo@latest # 升级 Expo SDK
npx expo install --fix # 将所有依赖升级以匹配已安装的 SDK 版本
eas credentials -p android # 获取 Android SHA256 证书指纹
npx setup-safari # 自动将捆绑标识符注册到 Apple 帐户，为 ID 分配权限，并在商店中创建 iTunes 应用条目
```

## More

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

## 分析 JavaScript 包

```sh
EXPO_UNSTABLE_ATLAS=true npx expo start # 使用 Atlas 分析包大小
EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev # 将开发模式更改为生产模式
EXPO_UNSTABLE_ATLAS=true npx expo export & npx expo-atlas .expo/atlas.jsonl # 使用 Atlas 与 npx expo export 结合
```

## TODO

- 应用图标、启屏图片
- Webview
- 应用链接
- 应用变体（debug、release、production | free、paid）
