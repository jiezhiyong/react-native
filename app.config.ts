import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || '',
  slug: config.slug || '',
  icon: process.env.ENVIRONMENT === 'production' ? './assets/images/icon.png' : './assets/images/icon.png',
  plugins: ['expo-secure-store'],
});
