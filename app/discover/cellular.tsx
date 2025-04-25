import * as Cellular from 'expo-cellular';
import { PermissionStatus } from 'expo-modules-core';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

interface CellularInfo {
  carrier: string | null;
  isoCountryCode: string | null;
  mobileCountryCode: string | null;
  mobileNetworkCode: string | null;
  allowsVoip: boolean | null;
  cellularGeneration: Cellular.CellularGeneration | null;
}

export default function ExpoCellularScreen() {
  const [status, requestPermission] = Cellular.usePermissions();
  const [cellularInfo, setCellularInfo] = useState<CellularInfo | null>(null);

  const doRequestPermission = useCallback(async () => {
    const newStatus = await requestPermission();
    if (newStatus.status !== PermissionStatus.GRANTED) {
      Alert.alert('权限受限', '无法获取完整的蜂窝网络信息，因为缺少必要权限。', [{ text: '确定' }]);
    }
  }, [requestPermission]);

  // 如果未授权，请求权限
  useEffect(() => {
    if (status?.status !== PermissionStatus.GRANTED) {
      doRequestPermission();
    }
  }, [status, doRequestPermission]);

  // 当权限已授予时，获取信息
  useEffect(() => {
    async function getCellularInfo() {
      try {
        const allowsVoip = await Cellular.allowsVoipAsync();
        const carrier = await Cellular.getCarrierNameAsync();
        const cellularGeneration = await Cellular.getCellularGenerationAsync();
        const isoCountryCode = await Cellular.getIsoCountryCodeAsync();
        const mobileCountryCode = await Cellular.getMobileCountryCodeAsync();
        const mobileNetworkCode = await Cellular.getMobileNetworkCodeAsync();

        setCellularInfo({
          carrier,
          isoCountryCode,
          mobileCountryCode,
          mobileNetworkCode,
          allowsVoip,
          cellularGeneration,
        });
      } catch (error: any) {
        console.error('获取蜂窝网络信息失败:', error);
        toast.error('获取蜂窝网络信息失败', { description: error.message });
      }
    }

    if (status?.status === PermissionStatus.GRANTED) {
      getCellularInfo();
    }
  }, [status]);

  const renderInfoItem = (label: string, value: any) => (
    <View className="flex-row justify-between mb-4 border-b border-border pb-4">
      <Text className="text-secondary-foreground font-medium">{label}</Text>
      <Text>{value === null ? '不可用' : String(value)}</Text>
    </View>
  );

  // 获取网络类型的友好显示名称
  const getGenerationDisplayName = (generation: Cellular.CellularGeneration | null) => {
    if (!generation) return '未知';

    switch (generation) {
      case Cellular.CellularGeneration.CELLULAR_2G:
        return '2G';
      case Cellular.CellularGeneration.CELLULAR_3G:
        return '3G';
      case Cellular.CellularGeneration.CELLULAR_4G:
        return '4G';
      case Cellular.CellularGeneration.CELLULAR_5G:
        return '5G';
      default:
        return String(generation);
    }
  };

  if (status?.status !== PermissionStatus.GRANTED) {
    return (
      <View className="bg-muted rounded-xl p-6">
        <Text className="text-center mb-6">需要电话状态权限来访问蜂窝网络信息</Text>
        <Button onPress={() => requestPermission()}>
          <Text>授予权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View>
      {cellularInfo && (
        <View className="pt-4">
          {renderInfoItem('运营商', cellularInfo.carrier)}
          {renderInfoItem('国家代码 (ISO)', cellularInfo.isoCountryCode)}
          {renderInfoItem('移动国家代码 (MCC)', cellularInfo.mobileCountryCode)}
          {renderInfoItem('移动网络代码 (MNC)', cellularInfo.mobileNetworkCode)}
          {renderInfoItem('支持网络通话 (VoIP)', cellularInfo.allowsVoip ? '是' : '否')}
          {renderInfoItem('网络类型', getGenerationDisplayName(cellularInfo.cellularGeneration))}
        </View>
      )}

      <View className="mt-4 bg-muted p-4 rounded-xl">
        <Text className="text-muted-foreground">
          注意: 在模拟器上或在没有 SIM 卡的设备上，某些信息可能无法获取。此示例最好在真实设备上测试。
        </Text>
      </View>
    </View>
  );
}
