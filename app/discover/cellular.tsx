import * as Cellular from 'expo-cellular';
import { CellularGeneration } from 'expo-cellular';
import { PermissionStatus } from 'expo-modules-core';
import React, { useState } from 'react';
import { View } from 'react-native';

import { InfoItemCol } from '@/components/InfoItem';
import { toast } from '@/components/ui/sonner';
import { useEffectAsync } from '@/hooks/use-effect-async';

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

  // 当权限已授予时，获取信息
  useEffectAsync(async () => {
    if (status?.status === PermissionStatus.GRANTED) {
      await getCellularInfo();
    }
  }, [status]);

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
    } catch (error) {
      console.error('获取蜂窝网络信息失败:', error);
      toast.error('获取蜂窝网络信息失败', { description: (error as Error).message });
    }
  }

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">蜂窝网络</Text>
          <Text className="text-muted-foreground">蜂窝服务提供商信息</Text>
        </View>

        <InfoItemCol label="运营商" value={cellularInfo?.carrier} />
        <InfoItemCol label="网络类型" value={CellularGeneration[cellularInfo?.cellularGeneration || 0]} />
        <InfoItemCol label="国家代码 (ISO)" value={cellularInfo?.isoCountryCode} />
        <InfoItemCol label="移动国家代码 (MCC)" value={cellularInfo?.mobileCountryCode} />
        <InfoItemCol label="移动网络代码 (MNC)" value={cellularInfo?.mobileNetworkCode} />
        <InfoItemCol label="支持网络通话 (VoIP)" value={cellularInfo?.allowsVoip ? '是' : '否'} />
      </View>

      <Button onPress={() => requestPermission()} disabled={status?.status === PermissionStatus.GRANTED}>
        <Text className="capitalize">请求权限 ({status?.status})</Text>
      </Button>
    </View>
  );
}
