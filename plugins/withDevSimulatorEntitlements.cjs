const { withEntitlementsPlist } = require('expo/config-plugins');

const SIGNING_REQUIRED_ENTITLEMENTS = ['com.apple.developer.applesignin', 'com.apple.developer.associated-domains'];

/**
 * 为开发模拟器构建添加必要的权限
 * Expo CLI 需要一个 Apple Developer 签名身份，以便在有这些能力时为模拟器构建签名。
 * 开发模拟器构建不需要原生权限，所以在其他配置插件添加权限后删除它们, 否则需要有 Apple Developer 签名身份。
 * 测试/生产构建通过不应用此插件来保留这些能力。
 */
module.exports = function withDevSimulatorEntitlements(config) {
  return withEntitlementsPlist(config, (config) => {
    for (const entitlement of SIGNING_REQUIRED_ENTITLEMENTS) {
      delete config.modResults[entitlement];
    }

    return config;
  });
};
