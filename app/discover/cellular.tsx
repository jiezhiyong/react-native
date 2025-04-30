import * as Cellular from 'expo-cellular';
import { CellularGeneration } from 'expo-cellular';
import { PermissionStatus } from 'expo-modules-core';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { InfoItem } from '~/components/InfoItem';
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

  if (status?.status !== PermissionStatus.GRANTED) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">蜂窝网络</Text>
          <Text className="text-muted-foreground">获取和监控设备的蜂窝网络连接状态。</Text>
        </View>

        <Text className="text-center mb-6">需要电话状态权限来访问蜂窝网络信息</Text>
        <Button onPress={() => requestPermission()}>
          <Text>授予权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 px-5 pt-5">
      <ScrollView className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">蜂窝网络</Text>
          <Text className="text-muted-foreground">蜂窝服务提供商信息</Text>
        </View>

        <InfoItem label="运营商" value={cellularInfo?.carrier} />
        <InfoItem label="网络类型" value={CellularGeneration[cellularInfo?.cellularGeneration || 0]} />
        <InfoItem label="国家代码 (ISO)" value={cellularInfo?.isoCountryCode} />
        <InfoItem label="移动国家代码 (MCC)" value={cellularInfo?.mobileCountryCode} />
        <InfoItem label="移动网络代码 (MNC)" value={cellularInfo?.mobileNetworkCode} />
        <InfoItem label="支持网络通话 (VoIP)" value={cellularInfo?.allowsVoip ? '是' : '否'} />
      </ScrollView>

      <Button onPress={() => requestPermission()} disabled={status?.status === PermissionStatus.GRANTED}>
        <Text className="capitalize">授予权限 ({status?.status})</Text>
      </Button>
    </View>
  );
}
