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

# Android
- eas build --platform android --profile development # eas
- npx expo run:android

# iOS
- eas build --platform ios --profile development # eas
- npx expo run:ios # simulator
- npx expo run:ios --device # device
```
