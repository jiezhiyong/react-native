import Clipboard from '@react-native-clipboard/clipboard';
import { BrowserQRCodeReader } from '@zxing/browser';
import * as ImagePicker from 'expo-image-picker';
import { PermissionStatus } from 'expo-modules-core';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle2, History, ImagePlus, LampDesk } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import validator from 'validator';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';
import { useScanHistoryStore } from '@/store/scan-history';

export default function ScanScreenNative() {
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');

  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Camera>(null);
  const router = useRouter();
  const { LL } = useI18nContext();

  // 使用react-native-vision-camera的权限hook
  const { hasPermission, requestPermission } = useCameraPermission();

  // 使用Zustand store来管理历史记录
  const addHistory = useScanHistoryStore((state) => state.addHistory);

  // 请求相机权限
  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission]);

  // 处理扫描结果
  const handleBarCodeScanned = useCallback(
    (codes: Code[]) => {
      if (scanned || codes.length === 0) return;

      const code = codes[0];
      if (!code.value) return;

      const data = code.value;
      setScanned(true);
      const isValidUrl = validator.isURL(data);
      setScannedData(data);

      if (isValidUrl) {
        // 添加到历史记录
        addHistory(data, isValidUrl);

        // 如果是URL，使用WebView打开
        router.push({
          pathname: '/webview',
          params: { url: data },
        });
      } else {
        // 不是URL，显示弹窗
        setModalVisible(true);
      }
    },
    [scanned, addHistory, router]
  );

  // 二维码和条形码扫描器
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'], // 支持二维码和条形码
    onCodeScanned: handleBarCodeScanned,
  });

  // 复制文本到剪贴板
  const copyToClipboard = () => {
    Clipboard.setString(scannedData);
    Alert.alert(LL.common.copied(), LL.common.contentCopied());
    setModalVisible(false);
  };

  // 从相册选择图片并解析二维码
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(LL.scan.albumPermissionTitle(), LL.scan.albumPermissionMessage());
      return;
    }

    try {
      // 打开图片选择器
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets[0].uri) {
        return;
      }

      // 显示加载中提示
      Alert.alert(LL.scan.processingTitle(), LL.scan.processingMessage());

      try {
        const codeReader = new BrowserQRCodeReader();
        const decoded = await codeReader.decodeFromImageUrl(result.assets[0].uri);
        const qrData = decoded.getText();

        // 扫描成功，处理扫描结果
        setScanned(true);
        const isValidUrl = validator.isURL(qrData);
        setScannedData(qrData);

        if (isValidUrl) {
          // 添加到历史记录
          addHistory(qrData, isValidUrl);

          // 如果是URL，使用WebView打开
          router.push({
            pathname: '/webview',
            params: { url: qrData },
          });
        } else {
          // 不是URL，显示弹窗
          setModalVisible(true);
        }
      } catch (error) {
        // 解析失败
        console.error('二维码解析失败', error);
        Alert.alert(LL.scan.recognitionFailedTitle(), LL.scan.recognitionFailedMessage());
      }
    } catch (error) {
      console.error('选择图片失败', error);
      Alert.alert(LL.common.error(), LL.scan.imagePickError());
    }
  };

  // 获取相机设备
  const device = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });

  // 切换闪光灯
  const toggleFlash = () => {
    setTorch(!torch);
  };

  // 渲染扫描结果弹窗
  const renderResultModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="m-5 bg-background p-5 rounded-2xl w-10/12">
            <View className="items-center mb-4">
              <CheckCircle2 size={50} color="#4ade80" />
              <Text className="text-xl font-bold mt-2">{LL.scan.contentTitle()}</Text>
            </View>

            <View className="p-4 rounded-lg mb-5 border-green-500 border">
              <Text className="text-center">{scannedData}</Text>
            </View>

            <View className="flex-row gap-3">
              <Button onPress={copyToClipboard} className="flex-1 rounded-full">
                <Text>{LL.scan.copy()}</Text>
              </Button>
              <Button onPress={() => setModalVisible(false)} className="flex-1 rounded-full" variant="secondary">
                <Text>{LL.scan.close()}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // 如果没有摄像头权限，显示请求权限的UI
  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 p-4">
        <Text className="text-white text-xl mb-4 text-center">{LL.scan.cameraPermission()}</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-primary-foreground font-medium">{LL.scan.grantAccess()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 如果没有可用的摄像头，显示错误信息
  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 p-4">
        <Text className="text-white text-xl text-center">{LL.scan.noCamera()}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: LL.routes.scan(),
        }}
      />

      {/* 相机容器 */}
      <View className="flex-1">
        <Text className="text-white w-full text-center p-5 absolute top-0 z-10 font-medium">
          {LL.scan.instruction()}
        </Text>

        <Camera
          ref={cameraRef}
          style={{ width: '100%', height: '100%', flex: 1 }}
          device={device}
          isActive={!scanned}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          enableZoomGesture
          videoHdr={false}
          videoStabilizationMode="off"
          enableBufferCompression={true}
          photoQualityBalance="speed"
          fps={30}
        >
          <View className="h-full w-full">
            <View className="flex-1 bg-black/50" />
            <View className="flex-row flex-1">
              <View className="flex-1 bg-black/50" />
              <View className="w-[200px] h-[200px] justify-center items-center relative">
                {/* 扫描框四角 */}
                <View className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-400" />
                <View className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-400" />
                <View className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-400" />
                <View className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-400" />
              </View>
              <View className="flex-1 bg-black/50" />
            </View>
            <View className="flex-1 bg-black/50" />
          </View>
        </Camera>
      </View>

      {/* 底部工具栏 */}
      <View
        className="flex-row justify-center absolute bottom-0 z-10 w-full"
        style={{ marginBottom: insets.bottom || 35 }}
      >
        {/* 闪光灯按钮 */}
        <TouchableOpacity onPress={toggleFlash} className="items-center flex-1">
          <View className="size-14 rounded-full bg-black/60 justify-center items-center mb-2">
            <LampDesk size={20} color={torch ? 'yellow' : 'white'} />
          </View>
          <Text className="text-white text-xs">{LL.scan.flashlight()}</Text>
        </TouchableOpacity>

        {/* 从相册选择按钮 */}
        <TouchableOpacity onPress={pickImage} className="items-center flex-1">
          <View className="size-14 rounded-full bg-black/60 justify-center items-center mb-2">
            <ImagePlus size={20} color="white" />
          </View>
          <Text className="text-white text-xs">{LL.scan.chooseFromAlbum()}</Text>
        </TouchableOpacity>

        {/* 历史记录按钮 */}
        <TouchableOpacity onPress={() => router.push('/scan/history')} className="items-center flex-1">
          <View className="size-14 rounded-full bg-black/60 justify-center items-center mb-2">
            <History size={20} color="white" />
          </View>
          <Text className="text-white text-xs">{LL.scan.history()}</Text>
        </TouchableOpacity>
      </View>

      {/* 显示扫描结果的弹窗 */}
      {renderResultModal()}

      {/* 如果已扫描，显示重新扫描按钮 */}
      {scanned && (
        <Button
          variant="destructive"
          className="absolute bottom-[120px] left-1/2 -translate-x-1/2"
          onPress={() => setScanned(false)}
        >
          <Text className="font-medium">{LL.scan.scanAgain()}</Text>
        </Button>
      )}
    </View>
  );
}
