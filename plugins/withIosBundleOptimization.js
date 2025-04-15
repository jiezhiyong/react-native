// 优化 iOS 构建过程，在调试模式下跳过打包
// https://reactnative.dev/docs/publishing-to-app-store#pro-tips
const withIosBundleOptimization = (config) => {
  return config;
};

module.exports = withIosBundleOptimization;
