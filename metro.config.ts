const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const config = getSentryExpoConfig(__dirname, {
  isCSSEnabled: true,
});

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
  },
};

// Adds support for `.db` files for SQLite databases
config.resolver.assetExts.push('db');

module.exports = withNativeWind(config, { input: './global.css' });
