import 'ts-node/register';
import { ConfigContext, ExpoConfig } from 'expo/config';

const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

// 以 .ts 格式复写 app.json
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: 'QA Chat',
  slug: 'qachat',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'qachat',
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
    package: 'com.jiezhiyong.qachat',
    softwareKeyboardLayoutMode: 'pan',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    blockedPermissions: ['android.permission.RECORD_AUDIO'],
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
            host: 'qachat.com.ngrok.io',
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
  },
  owner: 'jiezhiyong',
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/240e7c3e-9922-48a7-9a4a-84be0fcc615c',
  },

  icon: process.env.ENVIRONMENT === 'production' ? './assets/images/icon.png' : './assets/images/icon.png',

  ios: {
    bundleIdentifier: 'com.jiezhiyong.qachat',
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
      `applinks:qachat.com`,
      `activitycontinuation:qachat.com`,
      `webcredentials:qachat.com`,
    ],
  },

  plugins: [
    'expo-secure-store',
    'expo-localization',
    [
      'expo-router',
      {
        headOrigin: process.env.NODE_ENV === 'development' ? `https://${ngrokUrl}` : 'https://qachat.com',
        origin: 'https://qachat.com',
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url: 'https://sentry.io/',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
      },
    ],
    [
      'expo-notifications',
      {
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
});
