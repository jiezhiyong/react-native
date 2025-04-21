import 'ts-node/register';

import { ConfigContext, ExpoConfig } from 'expo/config';

const VERSION_CODE = 1;
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_TEST = process.env.APP_VARIANT === 'test';
const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

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
    return 'Chat QA (Dev)';
  } else if (IS_TEST) {
    return 'Chat QA (Test)';
  }
  return 'Chat QA';
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
  newArchEnabled: true,
  jsEngine: 'hermes',
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  android: {
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
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: 'This app uses the camera to scan barcodes on event tickets.',
      LSApplicationQueriesSchemes: ['uber'],
      CFBundleAllowMixedLocalizations: true,
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
    associatedDomains: [
      `applinks:${ngrokUrl}`,
      `activitycontinuation:${ngrokUrl}`,
      `webcredentials:${ngrokUrl}`,
      `applinks:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
      `activitycontinuation:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
      `webcredentials:${process.env.EXPO_TUNNEL_SUBDOMAIN}`,
    ],
  },

  plugins: [
    ['./plugins/withAndroidQueries.js', {}],
    ['expo-secure-store', {}],
    ['expo-localization', {}],
    ['expo-audio', {}],
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
        photosPermission: '允许 $(PRODUCT_NAME) 访问您的照片',
        savePhotosPermission: '允许 $(PRODUCT_NAME) 保存照片',
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
        cameraPermissionText: '$(PRODUCT_NAME) needs access to your Camera.',
        enableCodeScanner: true,
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#232323',
        image: './assets/images/splash-icon.png',
        dark: {
          image: './assets/images/splash-icon-dark.png',
          backgroundColor: '#000000',
        },
        imageWidth: 200,
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: 'Allow $(PRODUCT_NAME) to access your calendar',
        remindersPermission: 'Allow $(PRODUCT_NAME) to access your reminders',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.',
      },
    ],
    [
      'expo-sensors',
      {
        motionPermission: 'Allow $(PRODUCT_NAME) to access your device motion.',
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
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
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
        userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    [
      'expo-video',
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
  ],
});
