/* eslint-env node */

const path = require('path');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const config = getSentryExpoConfig(__dirname, {
  isCSSEnabled: true,
});

const isDevelopmentVariant = process.env.APP_VARIANT === 'development';
const isProductionVariant = !['development', 'preview'].includes(process.env.APP_VARIANT);

// 添加路径别名配置
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
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

const wrapped = withNativeWind(config, { input: './global.css' });
// 必须在 withNativeWind 之后设置：否则会被 css-interop / nativewind 合并配置覆盖。
// 关闭 package.exports 可减少 three 等库在 Metro 下的 exports 解析告警与歧义。
// https://github.com/expo/expo/discussions/36551
const previousResolveRequest = wrapped.resolver?.resolveRequest;
wrapped.resolver = {
  ...wrapped.resolver,
  unstable_enablePackageExports: false,
  // three 的 exports 将子路径指到无扩展名文件，实际文件为 *.js，直接解析会触发 Metro 的 package exports 回退 WARN
  resolveRequest: (context, moduleName, platform) => {
    if (
      isProductionVariant &&
      (moduleName === '@/debug-panel/runtime/DebugPanelHost' ||
        moduleName === './runtime/DebugPanelHost' ||
        moduleName === '../runtime/DebugPanelHost')
    ) {
      return context.resolveRequest(
        context,
        path.resolve(__dirname, 'debug-panel/runtime/DebugPanelHost.noop.tsx'),
        platform
      );
    }

    if (
      !isDevelopmentVariant &&
      (moduleName === '@/debug-panel/dev-menu/register' ||
        moduleName === '../dev-menu/register' ||
        moduleName === './dev-menu/register')
    ) {
      return context.resolveRequest(context, path.resolve(__dirname, 'debug-panel/dev-menu/noop.ts'), platform);
    }

    if (
      previousResolveRequest &&
      typeof moduleName === 'string' &&
      moduleName.startsWith('three/examples/jsm/') &&
      !/\.(m?js|cjs|json)$/.test(moduleName)
    ) {
      return previousResolveRequest(context, `${moduleName}.js`, platform);
    }
    if (previousResolveRequest) {
      return previousResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = wrapped;
