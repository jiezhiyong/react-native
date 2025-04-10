import { ConfigContext, ExpoConfig } from 'expo/config';

const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

// 以 .ts 格式复写 app.json
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || '',
  slug: config.slug || '',
  icon: process.env.ENVIRONMENT === 'production' ? './assets/images/icon.png' : './assets/images/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jiezhiyong.qachat',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: 'This app uses the camera to scan barcodes on event tickets.',
      LSApplicationQueriesSchemes: ['uber'],
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
    [
      'expo-router',
      {
        headOrigin: process.env.NODE_ENV === 'development' ? `https://${ngrokUrl}` : 'https://qachat.com',
        origin: 'https://qachat.com',
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
