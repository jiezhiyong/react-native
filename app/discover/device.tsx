import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

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

  // 获取设备信息
  const getDeviceInfo = async () => {
    try {
      // 获取设备根状态
      const isRooted = await Device.isRootedExperimentalAsync();

      // 获取平台功能列表
      const platformFeatures = await Device.getPlatformFeaturesAsync();

      // 格式化设备类型
      let deviceTypeString = '未知';
      switch (Device.deviceType) {
        case Device.DeviceType.PHONE:
          deviceTypeString = '手机';
          break;
        case Device.DeviceType.TABLET:
          deviceTypeString = '平板';
          break;
        case Device.DeviceType.DESKTOP:
          deviceTypeString = '桌面';
          break;
        case Device.DeviceType.TV:
          deviceTypeString = '电视';
          break;
        default:
          deviceTypeString = '未知';
      }

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
        deviceType: deviceTypeString,
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

      toast.success('设备信息已更新');
    } catch (error) {
      console.error('获取设备信息失败:', error);
      toast.error('获取设备信息失败');
    }
  };

  // 组件加载时获取设备信息
  useEffect(() => {
    getDeviceInfo();
  }, []);

  // 信息项组件
  const InfoItem = ({ label, value }: { label: string; value: string | number | null | boolean }) => (
    <View className="mb-2 flex-row justify-between">
      <Text className="font-medium">{label}:</Text>
      <Text className="text-secondary-foreground">
        {value !== null && value !== undefined ? String(value) : '不可用'}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">设备信息</Text>
        <Text className="text-secondary-foreground">获取设备型号、操作系统和硬件规格等详细信息。</Text>
      </View>

      {/* 基本设备信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-4">基本设备信息</Text>
        <InfoItem label="是否为真实设备" value={deviceInfo.isDevice ? '是' : '否'} />
        <InfoItem label="品牌" value={deviceInfo.brand} />
        <InfoItem label="制造商" value={deviceInfo.manufacturer} />
        <InfoItem label="型号名称" value={deviceInfo.modelName} />
        <InfoItem label="型号ID" value={deviceInfo.modelId} />
        <InfoItem label="设备类型" value={deviceInfo.deviceType} />
        <InfoItem label="设备名称" value={deviceInfo.deviceName} />
        <InfoItem label="设备年份等级" value={deviceInfo.deviceYearClass} />
      </Card>

      {/* 系统信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-4">系统信息</Text>
        <InfoItem label="操作系统" value={deviceInfo.osName} />
        <InfoItem label="操作系统版本" value={deviceInfo.osVersion} />
        <InfoItem label="构建ID" value={deviceInfo.osBuildId} />
        <InfoItem label="内部构建ID" value={deviceInfo.osInternalBuildId} />
        <InfoItem label="是否已Root/越狱" value={deviceInfo.isRooted ? '是' : '否'} />
      </Card>

      {/* 硬件信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-4">硬件信息</Text>
        <InfoItem label="总内存" value={deviceInfo.totalMemory} />
        <InfoItem label="支持的CPU架构" value={deviceInfo.supportedCpuArchitectures?.join(', ') || null} />
        <InfoItem label="设计名称" value={deviceInfo.designName} />
        <InfoItem label="产品名称" value={deviceInfo.productName} />
      </Card>

      {/* 平台功能 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-2">平台功能</Text>
        <Text className="text-secondary-foreground mb-2">
          {deviceInfo.platformFeatures && deviceInfo.platformFeatures.length > 0
            ? '支持的平台功能列表:'
            : '此平台不支持功能列表查询或无可用功能'}
        </Text>
        {deviceInfo.platformFeatures && deviceInfo.platformFeatures.length > 0 ? (
          <View className="bg-card-foreground/5 p-3 rounded-md">
            {deviceInfo.platformFeatures.slice(0, 10).map((feature, index) => (
              <Text key={index} className="text-xs text-secondary-foreground mb-1">
                • {feature}
              </Text>
            ))}
            {deviceInfo.platformFeatures.length > 10 && (
              <Text className="text-xs text-secondary-foreground italic">
                ...以及 {deviceInfo.platformFeatures.length - 10} 个更多功能
              </Text>
            )}
          </View>
        ) : null}
      </Card>

      {/* 刷新按钮 */}
      <Button onPress={getDeviceInfo}>
        <Text>刷新设备信息</Text>
      </Button>
    </ScrollView>
  );
}
