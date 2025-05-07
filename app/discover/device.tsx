import * as Device from 'expo-device';
import { DeviceType } from 'expo-device';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { InfoItemRow } from '~/components/InfoItem';
import { Card } from '~/components/ui/card';
import { toast } from '~/components/ui/sonner';
import { Text } from '~/components/ui/text';

export default function ExpoDeviceScreen() {
  const [deviceInfo, setDeviceInfo] = useState<{
    isDevice: boolean;
    brand: string | null;
    manufacturer: string | null;
    modelName: string | null;
    modelId: string | null;
    deviceType: string;
    designName: string | null;
    productName: string | null;
    deviceYearClass: number | null;
    totalMemory: string | null;
    supportedCpuArchitectures: string[] | null;
    osName: string | null;
    osVersion: string | null;
    osBuildId: string | null;
    osInternalBuildId: string | null;
    deviceName: string | null;
    isRooted: boolean | null;
    platformFeatures: string[];
  }>({
    isDevice: false,
    brand: null,
    manufacturer: null,
    modelName: null,
    modelId: null,
    deviceType: '未知',
    designName: null,
    productName: null,
    deviceYearClass: null,
    totalMemory: null,
    supportedCpuArchitectures: null,
    osName: null,
    osVersion: null,
    osBuildId: null,
    osInternalBuildId: null,
    deviceName: null,
    isRooted: null,
    platformFeatures: [],
  });

  useEffect(() => {
    getDeviceInfo();
  }, []);

  // 获取设备信息
  const getDeviceInfo = async () => {
    try {
      // 获取设备根状态
      const isRooted = await Device.isRootedExperimentalAsync();

      // 获取平台功能列表
      const platformFeatures = await Device.getPlatformFeaturesAsync();

      // 格式化内存大小，转换为可读性更好的格式（GB或MB）
      let formattedMemory = null;
      if (Device.totalMemory) {
        const totalMemoryInMB = Device.totalMemory / (1024 * 1024);
        if (totalMemoryInMB >= 1024) {
          formattedMemory = `${(totalMemoryInMB / 1024).toFixed(2)} GB`;
        } else {
          formattedMemory = `${totalMemoryInMB.toFixed(2)} MB`;
        }
      }

      // 更新状态
      setDeviceInfo({
        isDevice: Device.isDevice,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        modelId: Device.modelId,
        deviceType: DeviceType[Device.deviceType as any],
        designName: Device.designName,
        productName: Device.productName,
        deviceYearClass: Device.deviceYearClass,
        totalMemory: formattedMemory,
        supportedCpuArchitectures: Device.supportedCpuArchitectures,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        osInternalBuildId: Device.osInternalBuildId,
        deviceName: Device.deviceName,
        isRooted,
        platformFeatures,
      });
    } catch (error) {
      console.error('获取设备信息失败:', error);
      toast.error('获取设备信息失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">设备信息</Text>
        <Text className="text-muted-foreground">获取设备型号、操作系统和硬件规格等详细信息</Text>
      </View>

      {/* 基本设备信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">基本设备信息</Text>
        <InfoItemRow label="是否为真实设备" value={deviceInfo.isDevice ? '是' : '否'} />
        <InfoItemRow label="品牌" value={deviceInfo.brand} />
        <InfoItemRow label="制造商" value={deviceInfo.manufacturer} />
        <InfoItemRow label="型号名称" value={deviceInfo.modelName} />
        <InfoItemRow label="型号ID" value={deviceInfo.modelId} />
        <InfoItemRow label="设备类型" value={deviceInfo.deviceType} />
        <InfoItemRow label="设备名称" value={deviceInfo.deviceName} />
        <InfoItemRow label="设备年份等级" value={deviceInfo.deviceYearClass} />
      </Card>

      {/* 系统信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">系统信息</Text>
        <InfoItemRow label="操作系统" value={deviceInfo.osName} />
        <InfoItemRow label="操作系统版本" value={deviceInfo.osVersion} />
        <InfoItemRow label="构建ID" value={deviceInfo.osBuildId} />
        <InfoItemRow label="内部构建ID" value={deviceInfo.osInternalBuildId} />
        <InfoItemRow label="是否已Root/越狱" value={deviceInfo.isRooted ? '是' : '否'} />
      </Card>

      {/* 硬件信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">硬件信息</Text>
        <InfoItemRow label="总内存" value={deviceInfo.totalMemory} />
        <InfoItemRow label="支持的CPU架构" value={deviceInfo.supportedCpuArchitectures?.join(', ') || null} />
        <InfoItemRow label="设计名称" value={deviceInfo.designName} />
        <InfoItemRow label="产品名称" value={deviceInfo.productName} />
      </Card>

      {/* 平台功能 */}
      <Card className="p-4 mb-[1]">
        <Text className="text-lg font-medium mb-2">平台功能</Text>
        <Text className="text-muted-foreground mb-2">
          {deviceInfo.platformFeatures && deviceInfo.platformFeatures.length > 0
            ? '支持的平台功能列表:'
            : '此平台不支持功能列表查询, 或无可用功能'}
        </Text>
        {deviceInfo.platformFeatures && deviceInfo.platformFeatures.length > 0 ? (
          <View className="bg-card-foreground/5 p-3 rounded-lg">
            {deviceInfo.platformFeatures.slice(0, 10).map((feature, index) => (
              <Text key={index} className="text-xs text-muted-foreground mb-1">
                • {feature}
              </Text>
            ))}
            {deviceInfo.platformFeatures.length > 10 && (
              <Text className="text-xs text-muted-foreground italic">
                ...以及 {deviceInfo.platformFeatures.length - 10} 个更多功能
              </Text>
            )}
          </View>
        ) : null}
      </Card>
    </ScrollView>
  );
}
