const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * 对于 Android 11（API 级别 30）及更高版本，必须在 AndroidManifest.xml 文件中指定应用将处理的 Intent。
 * 这里通过创建配置插件来实现：定义 Intent 启用链接到电子邮件和电话应用程序
 */
const withAndroidQueries = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
            data: [{ $: { 'android:scheme': 'mailto' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
            data: [{ $: { 'android:scheme': 'tel' } }],
          },
        ],
      },
    ];

    console.log('✔ 成功添加 Android Queries 到 AndroidManifest.xml');
    return config;
  });
};

module.exports = withAndroidQueries;
