const path = require('path');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const config = getSentryExpoConfig(__dirname, {
  isCSSEnabled: true,
});

// 库与 Metro ES 模块解析不兼容问题：https://github.com/expo/expo/discussions/36551
// config.resolver.unstable_enablePackageExports = false;

// 添加路径别名配置
config.resolver.extraNodeModules = {
  '~': path.resolve(__dirname),
};

// enabling-tree-shaking
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

// remove-console-logs
config.transformer.minifierConfig = {
  compress: {
    drop_console: ['log', 'info'],

    ...(process.env.NO_MINIFY === 'true' // 可以通过环境变量控制是否压缩代码及__DEV__状态
      ? {
          dead_code: false,
          global_defs: {
            __DEV__: process.env.FORCE_DEV_MODE === 'true', // 明确设置__DEV__的值，根据FORCE_DEV_MODE环境变量
          },
        }
      : {}),
  },
};

// Adds support for `.db` files for SQLite databases
config.resolver.assetExts.push(...['db', 'mp3', 'ttf', 'obj', 'png', 'jpg']);

module.exports = withNativeWind(config, { input: './global.css' });
