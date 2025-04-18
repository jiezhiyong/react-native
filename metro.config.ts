const path = require('path');

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});
const config = getSentryExpoConfig(__dirname);

// 合并默认配置
const mergedConfig = mergeConfig(defaultConfig, config);

// 添加路径别名配置
mergedConfig.resolver.extraNodeModules = {
  '~': path.resolve(__dirname),
};

// enabling-tree-shaking
mergedConfig.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

// remove-console-logs
mergedConfig.transformer.minifierConfig = {
  compress: {
    drop_console: ['log', 'info'],
  },
};

// Adds support for `.db` files for SQLite databases
mergedConfig.resolver.assetExts.push('db');

module.exports = withNativeWind(mergedConfig, { input: './global.css' });
