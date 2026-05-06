# Expo app with EAS 👋

使用 EAS: 工作流、构建、托管、发布、更新、元数据、分析、分发 https://docs.expo.dev/eas

## 配置证书

```sh
eas credentials
```

## 注册 iOS 设备

```sh
eas device:create
```

## 创建开发版本、测试版本、生产版本构建 - 在 EAS 上构建 / 使用 EAS CLI 本地构建 (--local)

```sh
npm install -g eas-cli
eas build --profile <development | preview | production>
eas build -p ios --profile ios-simulator
eas build -p <android | ios> --auto-submit
```

### 提交构建

```sh
eas submit -p <android | ios>
```

### 提交 ios 商店元数据

```sh
eas metadata:push
```

### 发送无线更新

```sh
eas update:configure
eas update --branch development --message "Change first button label"
eas update --environment <production | preview | development>
npx sentry-expo-upload-sourcemaps dist # 上传源映射
eas update --auto
eas update --channel <production | preview | development>
```

### 部署 WEB 应用

```sh
npx expo export -p web
npx expo serve # 在本地进行测试
eas deploy
eas deploy --prod
```

## 其他

```sh
eas credentials -p android # 获取 Android SHA256 证书指纹
```
