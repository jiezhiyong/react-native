import 'ts-node/register';

import { ConfigContext, ExpoConfig } from 'expo/config';

const VERSION_CODE = 1;
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_TEST = process.env.APP_VARIANT === 'test';
const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;
const ENABLE_IOS_CAPABILITIES = !IS_DEV || process.env.EXPO_ENABLE_IOS_CAPABILITIES === 'true';
const IOS_CAPABILITY_PLUGINS: ExpoConfig['plugins'] = [['expo-apple-authentication', {}]];
const DEV_SIMULATOR_PLUGINS: ExpoConfig['plugins'] = [['./plugins/withDevSimulatorEntitlements.cjs', {}]];

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.jiezhiyong.qachat.dev';
  } else if (IS_TEST) {
    return 'com.jiezhiyong.qachat.test';
  }
  return 'com.jiezhiyong.qachat';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'ChatQA (Dev)';
  } else if (IS_TEST) {
    return 'ChatQA (Test)';
  }
  return 'ChatQA';
};

// 以 .ts 格式复写 app.json
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: getAppName(),
  icon: './assets/images/icon.png',
  slug: 'qachat',
  scheme: 'qachat',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  jsEngine: 'hermes',
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
  // splash: {
  //   image: './assets/images/splash.png',
  //   resizeMode: 'contain',
  //   backgroundColor: '#ffffff',
  // },
  assetBundlePatterns: ['**/*'],
  android: {
    // scheme: 'qachat',
    versionCode: VERSION_CODE,
    package: getUniqueIdentifier(),
    softwareKeyboardLayoutMode: 'pan',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.WAKE_LOCK',
      'android.permission.WRITE_SETTINGS',
      'android.permission.READ_PHONE_STATE',
      'android.permission.READ_MEDIA_IMAGES',
    ],
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  web: {
    bundler: 'metro',
    output: 'server',
    favicon: './assets/images/favicon.png',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`,
            pathPrefix: '/records',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  extra: {
    supportsRTL: true,
    router: {
      origin: false,
    },
    eas: {
      projectId: '240e7c3e-9922-48a7-9a4a-84be0fcc615c',
    },
    enableDebugPanel: process.env.ENABLE_DEBUG_PANEL === 'true',
  },
  owner: 'jiezhiyong',
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/240e7c3e-9922-48a7-9a4a-84be0fcc615c',
  },

  ios: {
    buildNumber: String(VERSION_CODE),
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: true,
    usesAppleSignIn: ENABLE_IOS_CAPABILITIES,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: '应用需要使用您的相机来扫描活动票券上的条形码，以便您快速参与活动。',
      LSApplicationQueriesSchemes: ['uber'],
      CFBundleAllowMixedLocalizations: true,
      CFBundleLocalizations: ['zh-Hans'],
      UIBackgroundModes: ['audio', 'fetch', 'processing'],
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
    associatedDomains: ENABLE_IOS_CAPABILITIES
      ? [
          `applinks:${ngrokUrl}`,
          `activitycontinuation:${ngrokUrl}`,
          `webcredentials:${ngrokUrl}`,
          `applinks:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
          `activitycontinuation:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
          `webcredentials:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
        ]
      : undefined,
    entitlements: {
      'com.apple.developer.networking.wifi-info': true,
    },
  },

  plugins: [
    ['./plugins/withAndroidQueries.cjs', {}],
    ['expo-font', {}],
    ['expo-image', {}],
    ['expo-sqlite', {}],
    ['expo-web-browser', {}],
    ['expo-secure-store', {}],
    ['expo-asset', {}],
    ['expo-background-task', {}],
    ['expo-build-properties', {}],
    ['expo-localization', {}],
    [
      'expo-router',
      {
        headOrigin: IS_DEV ? `https://${ngrokUrl}` : `https://${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
        origin: `https://${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
      },
    ],
    ['./plugins/withSentryDsymUpload.cjs', {}],
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url: process.env.SENTRY_URL,
        note: 'Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.',
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: '允许 $(PRODUCT_NAME) 访问您的照片，以便您可以选择并分享您喜欢的照片',
        savePhotosPermission: '允许 $(PRODUCT_NAME) 保存照片到您的相册，方便您随时查看',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'expo-notifications',
      {
        enableBackgroundRemoteNotifications: true,
      },
    ],
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: '允许 $(PRODUCT_NAME) 访问您的相机，以便您可以拍摄照片和视频',
        enableCodeScanner: true,
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#26292e',
        image: './assets/images/splash-icon.png',
        dark: {
          image: './assets/images/splash-icon-dark.png',
          backgroundColor: '#26292e',
        },
        imageWidth: 200,
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: '允许 $(PRODUCT_NAME) 访问您的日历，以便为您创建和管理活动提醒',
        remindersPermission: '允许 $(PRODUCT_NAME) 访问您的提醒事项，以帮助您管理待办任务',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: '允许 $(PRODUCT_NAME) 访问您的相机，以便您可以拍摄和分享精彩瞬间',
        microphonePermission: '允许 $(PRODUCT_NAME) 访问您的麦克风，以便在视频中录制声音',
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: '允许 $(PRODUCT_NAME) 访问您的联系人，以便您可以轻松分享内容给朋友',
      },
    ],
    [
      'expo-sensors',
      {
        motionPermission: '允许 $(PRODUCT_NAME) 访问您的设备运动数据，以提供更精准的体验',
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: '允许 $(PRODUCT_NAME) 使用面容 ID 功能，以便您快速安全地登录',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: '允许 $(PRODUCT_NAME) 使用您的位置信息，以便为您提供位置相关服务',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    [
      'expo-screen-orientation',
      {
        initialOrientation: 'DEFAULT',
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission: '该标识符将用于为您提供个性化广告，提升您的使用体验',
      },
    ],
    [
      'expo-video',
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      'expo-audio',
      {
        microphonePermission: '允许 $(PRODUCT_NAME) 访问您的麦克风，以便您可以录制音频和语音消息',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: '允许 $(PRODUCT_NAME) 访问您的照片，以便您可以选择并与朋友分享您的精彩瞬间',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: ['merchant.com.jiezhiyong.qachat'],
        enableGooglePay: false,
      },
    ],
    ['@react-native-community/datetimepicker', {}],
    ['expo-mail-composer', {}],
    ['expo-sharing', {}],
    ['@config-plugins/react-native-blob-util', {}],
    ['@config-plugins/react-native-pdf', {}],
    ...(ENABLE_IOS_CAPABILITIES ? IOS_CAPABILITY_PLUGINS : []),
    ...(ENABLE_IOS_CAPABILITIES ? [] : DEV_SIMULATOR_PLUGINS),
  ],
});
