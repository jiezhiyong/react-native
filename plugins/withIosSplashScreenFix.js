/**
 * 自定义插件，用于解决iOS应用启动时白屏闪烁问题
 * 通过在 AppDelegate.mm 中添加代码，保持闪屏显示直到 React Native 内容准备就绪
 * https://reactnative.dev/docs/publishing-to-app-store#pro-tips
 */
const withIosSplashScreenFix = (config) => {
  return config;
};

module.exports = withIosSplashScreenFix;
