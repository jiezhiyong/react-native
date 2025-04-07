# Expo app 👋

This is an [Expo](https://expo.dev) project. doc: [Expo documentation](https://docs.expo.dev) with [nativewind](https://nativewind.dev)、[react-native-reusables](https://rnr-docs.vercel.app)

## Get started

1. Install dependencies

   ```bash
    pnpm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## 添加通用组件

```sh
npx @react-native-reusables/cli@latest add
```

## Expo SDK

- [expo-auth-session](https://docs.expo.dev/versions/latest/sdk/auth-session)
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore)
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite)
- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera)
- [expo-network](https://docs.expo.dev/versions/latest/sdk/network)

## 重要组件 & 工具

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
- [sentry](https://docs.sentry.io/platforms/react-native)

- [...](https://reactnative.directory)

## 创建开发版本

```sh
npx expo install expo-dev-client
```

### 预构建

```sh
npx expo prebuild --clean # 使用 Prebuild 生成原生 Android 和 iOS 目录
npx expo prebuild --clean --platform android
npx expo prebuild --clean --platform ios
```

### 创建开发版本 - 本地构建

```sh
npx expo run:android
npx expo run:ios # - simulator, eas.json 需要设置 build.development.ios.simulator: true
npx expo run:ios --device # - device, eas.json 需要设置 build.development.ios.device: false
```

### 创建开发版本 - 在 EAS 上构建 / 使用 EAS CLI 本地构建 (--local)

```sh
npm install -g eas-cli
eas build --platform all --profile development
eas build --platform android --profile development
eas build --platform ios --profile development
```

## 创建生产构建 - 在 EAS 上构建 / 使用 EAS CLI 本地构建 (--local)

```sh
eas build --platform all --profile production
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 提交构建

```sh
eas submit --platform android
eas submit --platform ios
```

### 提交 ios 商店元数据

```sh
eas metadata:push
```

### 发送无线更新

```sh
eas update --auto
eas update:configure
eas update --channel production
```

### 部署 WEB 应用

```sh
npx expo export --platform web
eas deploy
eas deploy --prod
```

## 检查配置 https://docs.expo.dev/develop/tools/#expo-doctor

```sh
npx expo install --check
npx expo-doctor
```

## Orbit

```sh
brew install expo-orbit
```

## 其他

```sh
npx expo install --fix ## 将 Expo SDK 库更新为 SDK 版本的最新版本
```

## More

- 调试 https://docs.expo.dev/debugging/errors-and-warnings
- 权限 https://docs.expo.dev/guides/permissions
- 单元测试 https://docs.expo.dev/develop/unit-testing
- E2E https://docs.expo.dev/build-reference/e2e-tests
- 存储数据 https://docs.expo.dev/develop/user-interface/store-data/
- 使用 VS Code 进行调试 https://docs.expo.dev/debugging/tools/#debugging-with-vs-code
- Snack https://snack.expo.dev
- 使用 app config 配置 https://docs.expo.dev/workflow/configuration
