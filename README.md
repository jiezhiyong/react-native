# Expo app 👋

This is an [Expo](expo.dev) project. doc: [Expo documentation](https://docs.expo.dev/)

## Get started

1. Install dependencies

   ```bash
   npm install
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

## 创建开发版本 https://docs.expo.dev/develop/development-builds/create-a-build

```sh
npx expo install expo-dev-client

# Continuous Native Generation（CNG）
npx expo prebuild --clean

# Android
- eas build --platform android --profile development # eas
- npx expo run:android

# iOS
- eas build --platform ios --profile development # eas
- npx expo run:ios # simulator
- npx expo run:ios --device # device
```

## 使用应用程序配置进行配置 https://docs.expo.dev/workflow/configuration/

```sh
npx expo config
```

## 检查配置 https://docs.expo.dev/develop/tools/#expo-doctor

```sh
npx expo-doctor
```

## 存储数据 https://docs.expo.dev/develop/user-interface/store-data/

## 使用 VS Code 进行调试 https://docs.expo.dev/debugging/tools/#debugging-with-vs-code

## Snack 共享代码片段和试验 React Native https://snack.expo.dev/

## TODO

- brew install cocoapods
- brew install watchman
