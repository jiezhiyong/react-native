const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
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

// add .cjs extensions
const sourceExts = config.resolver.sourceExts;
const exts = process.env.RN_SRC_EXT ? process.env.RN_SRC_EXT.split(',').concat(sourceExts) : sourceExts;
config.resolver.sourceExts = [...exts, 'cjs'];

// Adds support for `.db` files for SQLite databases
config.resolver.assetExts.push('db');

module.exports = withNativeWind(config, { input: './global.css' });
