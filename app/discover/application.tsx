import * as Application from 'expo-application';
import { ApplicationReleaseType } from 'expo-application';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { InfoItemCol } from '~/components/InfoItem';
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
        const applicationName = Application.applicationName || '-';

        // 获取应用ID
        const applicationId = Application.applicationId || '-';

        // 获取应用版本号（用户可见的版本号）
        const nativeApplicationVersion = Application.nativeApplicationVersion || '-';

        // 获取应用构建版本号（内部版本号）
        const nativeBuildVersion = Application.nativeBuildVersion || '-';

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
          installReferrer = referrer || '-';
        } catch {
          // 忽略错误
        }

        // 获取Android ID（仅Android支持）
        let androidId = '-';
        try {
          const id = await Application?.getAndroidId();
          androidId = id || '-';
        } catch {
          // 忽略错误
        }

        // 获取iOS应用发布类型（仅iOS支持）
        let iosApplicationReleaseType = '-' as unknown as ApplicationReleaseType;
        try {
          const releaseType = await Application?.getIosApplicationReleaseTypeAsync();
          iosApplicationReleaseType = (releaseType || '-') as unknown as ApplicationReleaseType;
        } catch {
          // 忽略错误
        }

        // 获取iOS ID For Vendor（仅iOS支持）
        let iosIdForVendor = '-';
        try {
          const id = await Application?.getIosIdForVendorAsync();
          iosIdForVendor = id || '-';
        } catch {
          // 忽略错误
        }

        // 获取iOS推送通知服务环境（仅iOS支持）
        let iosPushNotificationServiceEnvironment = '-';
        try {
          const environment = await Application?.getIosPushNotificationServiceEnvironmentAsync();
          iosPushNotificationServiceEnvironment = environment || '-';
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

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">应用信息</Text>
        <Text className="text-muted-foreground">获取和显示应用程序的基本信息和状态。</Text>
      </View>

      <InfoItemCol label="应用名称" value={appInfo.applicationName} />
      <InfoItemCol label="应用ID" value={appInfo.applicationId} />
      <InfoItemCol label="应用版本" value={appInfo.nativeApplicationVersion} />
      <InfoItemCol label="构建版本" value={appInfo.nativeBuildVersion} />
      <InfoItemCol label="安装时间" value={appInfo.installationTime} />
      <InfoItemCol label="安装来源" value={appInfo.installReferrer} />
      <InfoItemCol label="Android ID" value={appInfo.androidId} />
      <InfoItemCol
        label="iOS 应用发布类型"
        value={`${appInfo.iosApplicationReleaseType}, ${ApplicationReleaseType[appInfo.iosApplicationReleaseType]}`}
      />
      <InfoItemCol label="iOS ID For Vendor (IDFV)" value={appInfo.iosIdForVendor} />
      <InfoItemCol label="iOS 推送通知服务环境" value={appInfo.iosPushNotificationServiceEnvironment} />
      <InfoItemCol label="最后更新时间" value={appInfo.lastUpdateTime} />
    </ScrollView>
  );
}
