import * as Application from 'expo-application';
import { ApplicationReleaseType } from 'expo-application';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '~/components/ui/text';

/**
 * Expo Application 演示屏幕
 * 使用expo-application获取应用信息
 */
export default function ExpoApplicationScreen() {
  const [appInfo, setAppInfo] = useState({
    applicationId: '',
    applicationName: '',
    nativeApplicationVersion: '',
    nativeBuildVersion: '',

    androidId: '',
    installationTime: '',
    installReferrer: '',
    iosApplicationReleaseType: '' as unknown as ApplicationReleaseType,
    iosIdForVendor: '',
    iosPushNotificationServiceEnvironment: '',
    lastUpdateTime: '',

    isDevice: false,
  });

  useEffect(() => {
    // 获取应用信息
    async function loadApplicationInfo() {
      try {
        // 获取应用名称（可能仅在某些平台支持）
        const applicationName = Application.applicationName || '未知';

        // 获取应用ID
        const applicationId = Application.applicationId || '未知';

        // 获取应用版本号（用户可见的版本号）
        const nativeApplicationVersion = Application.nativeApplicationVersion || '未知';

        // 获取应用构建版本号（内部版本号）
        const nativeBuildVersion = Application.nativeBuildVersion || '未知';

        // 获取应用安装时间（仅Android支持）
        let installationTime = '-';
        try {
          const installTime = await Application?.getInstallationTimeAsync();
          installationTime = new Date(installTime).toLocaleString();
        } catch {
          // 忽略错误
        }

        // 获取应用安装来源信息（仅Android支持）
        let installReferrer = '-';
        try {
          const referrer = await Application?.getInstallReferrerAsync();
          installReferrer = referrer || '未知';
        } catch {
          // 忽略错误
        }

        // 获取Android ID（仅Android支持）
        let androidId = '-';
        try {
          const id = await Application?.getAndroidId();
          androidId = id || '未知';
        } catch {
          // 忽略错误
        }

        // 获取iOS应用发布类型（仅iOS支持）
        let iosApplicationReleaseType = '-' as unknown as ApplicationReleaseType;
        try {
          const releaseType = await Application?.getIosApplicationReleaseTypeAsync();
          iosApplicationReleaseType = (releaseType || '未知') as unknown as ApplicationReleaseType;
        } catch {
          // 忽略错误
        }

        // 获取iOS ID For Vendor（仅iOS支持）
        let iosIdForVendor = '-';
        try {
          const id = await Application?.getIosIdForVendorAsync();
          iosIdForVendor = id || '未知';
        } catch {
          // 忽略错误
        }

        // 获取iOS推送通知服务环境（仅iOS支持）
        let iosPushNotificationServiceEnvironment = '-';
        try {
          const environment = await Application?.getIosPushNotificationServiceEnvironmentAsync();
          iosPushNotificationServiceEnvironment = environment || '未知';
        } catch {
          // 忽略错误
        }

        // 获取最后更新时间（仅Android支持）
        let lastUpdateTime = '-';
        try {
          const updateTime = await Application?.getLastUpdateTimeAsync();
          lastUpdateTime = new Date(updateTime).toLocaleString();
        } catch {
          // 忽略错误
        }

        // 设置应用信息状态
        setAppInfo({
          applicationName,
          applicationId,
          nativeApplicationVersion,
          nativeBuildVersion,

          androidId,
          iosApplicationReleaseType,
          iosIdForVendor,
          iosPushNotificationServiceEnvironment,
          lastUpdateTime,
          installationTime,
          installReferrer,

          isDevice: true,
        });
      } catch (error) {
        console.error('获取应用信息失败:', error);
      }
    }

    loadApplicationInfo();
  }, []);

  // 渲染信息项
  const renderInfoItem = (label: string, value: string | number | boolean) => (
    <View className="py-2 border-b border-gray-100">
      <Text className="text-gray-500 flex-1">{label}</Text>
      <Text className="text-lg font-medium">{value ? value.toString() : '-'}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">应用信息</Text>
        <Text className="text-secondary-foreground">获取和显示应用程序的基本信息和状态。</Text>
      </View>

      {renderInfoItem('应用名称', appInfo.applicationName)}
      {renderInfoItem('应用ID', appInfo.applicationId)}
      {renderInfoItem('应用版本', appInfo.nativeApplicationVersion)}
      {renderInfoItem('构建版本', appInfo.nativeBuildVersion)}
      {renderInfoItem('安装时间', appInfo.installationTime)}
      {renderInfoItem('安装来源', appInfo.installReferrer)}
      {renderInfoItem('Android ID', appInfo.androidId)}
      {renderInfoItem('iOS 应用发布类型', appInfo.iosApplicationReleaseType)}
      {renderInfoItem('iOS ID For Vendor', appInfo.iosIdForVendor)}
      {renderInfoItem('iOS 推送通知服务环境', appInfo.iosPushNotificationServiceEnvironment)}
      {renderInfoItem('最后更新时间', appInfo.lastUpdateTime)}
    </ScrollView>
  );
}
