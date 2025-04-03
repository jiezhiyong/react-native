# Expo app 👋

This is an [Expo](expo.dev) project. doc: [Expo documentation](https://docs.expo.dev/)

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](expo.dev/go), a limited sandbox for trying out app development with Expo

## 创建开发版本

```sh
npx expo install expo-dev-client
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
eas build --platform all
eas build --platform android --profile development
eas build --platform ios --profile development
```

### 预构建

```sh
npx expo prebuild --clean # 使用 Prebuild 生成原生 Android 和 iOS 目录
```

## 使用应用程序配置进行配置 https://docs.expo.dev/workflow/configuration/

```sh
npx expo config
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

## 存储数据 https://docs.expo.dev/develop/user-interface/store-data/

## 使用 VS Code 进行调试 https://docs.expo.dev/debugging/tools/#debugging-with-vs-code

## Snack 共享代码片段和试验 React Native https://snack.expo.dev/

## TODO

- brew install cocoapods
- brew install watchman
