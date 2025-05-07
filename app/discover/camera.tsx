import { CameraMode, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-modules-core';
import { Camera, SwitchCamera, Video, Zap, ZapOff } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, Pressable, TouchableOpacity, View } from 'react-native';

import { cn } from '~/lib/utils';

import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

export default function ExpoCameraScreen() {
  // 相机视图引用
  const cameraRef = useRef<CameraView>(null);

  // 相机权限
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // 请求媒体库权限
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);

  // 媒体文件URI (图片或视频)
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  // 摄像头模式：照片或视频
  const [mode, setMode] = useState<CameraMode>('picture');

  // 相机朝向：前置或后置
  const [facing, setFacing] = useState<CameraType>('back');

  // 闪光灯状态
  const [flash, setFlash] = useState<'on' | 'off'>('off');

  // 录制状态
  const [recording, setRecording] = useState(false);

  // 请求媒体库权限
  const requestMediaLibraryPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(permission.status === PermissionStatus.GRANTED);
    return permission.status === PermissionStatus.GRANTED;
  };

  // 初始化媒体库权限
  useState(() => {
    requestMediaLibraryPermission();
  });

  // 如果权限状态未确定
  if (!cameraPermission) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <Text className="text-center">正在检查相机权限...</Text>
      </View>
    );
  }

  // 如果没有相机权限
  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <Text className="text-center mb-6">需要相机权限才能使用此功能</Text>
        <Button onPress={requestCameraPermission}>
          <Text>申请相机权限</Text>
        </Button>
      </View>
    );
  }

  // 拍照
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setMediaUri(photo.uri);
        Alert.alert('是否保存照片', '照片已保存到相册', [
          {
            text: '保存',
            onPress: () => saveMedia(),
          },
          {
            text: '丢弃',
            onPress: () => setMediaUri(null),
          },
        ]);
      }
    } catch (error) {
      console.error('拍照时出错：', error);
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  // 录制视频
  const recordVideo = async () => {
    if (!cameraRef.current) return;

    try {
      if (recording) {
        setRecording(false);
        cameraRef.current.stopRecording();
        return;
      }

      setRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      if (video?.uri) {
        setMediaUri(video.uri);
        setRecording(false);

        Alert.alert('是否保存视频', '视频已保存到相册', [
          {
            text: '保存',
            onPress: () => saveMedia(),
          },
          {
            text: '丢弃',
            onPress: () => setMediaUri(null),
          },
        ]);
      }
    } catch (error) {
      console.error('录制视频时出错：', error);
      Alert.alert('错误', '视频录制失败，请重试');
      setRecording(false);
    }
  };

  // 保存媒体到相册
  const saveMedia = async () => {
    if (!mediaUri) return;

    // 如果没有权限，先请求权限
    if (!hasMediaLibraryPermission) {
      const granted = await requestMediaLibraryPermission();
      if (!granted) {
        Alert.alert('无法保存', '需要相册访问权限才能保存媒体文件');
        return;
      }
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(mediaUri);
      await MediaLibrary.createAlbumAsync('Expo相机', asset, false);
      Alert.alert('保存成功', mode === 'picture' ? '照片已保存到相册' : '视频已保存到相册');
    } catch (error) {
      console.error('保存媒体文件时出错：', error);
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  // 切换相机模式（照片/视频）
  const toggleMode = () => {
    setMode((prev) => (prev === 'picture' ? 'video' : 'picture'));
  };

  // 切换相机朝向（前置/后置）
  const toggleFacing = () => {
    setFacing((prev) => {
      const newFacing = prev === 'back' ? 'front' : 'back';
      // 如果切换到前置摄像头，自动关闭闪光灯
      if (newFacing === 'front' && flash === 'on') {
        setFlash('off');
      }
      return newFacing;
    });
  };

  // 切换闪光灯
  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">相机</Text>
        <Text className="text-muted-foreground">使用设备相机拍摄照片和录制视频，并支持保存到相册</Text>
      </View>

      <CameraView
        ref={cameraRef}
        style={{ flex: 1, width: '100%', borderRadius: 8, overflow: 'hidden' }}
        mode={mode}
        facing={facing}
        flash={flash}
        enableTorch={flash === 'on'}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        {/* 顶部工具栏 */}
        <View className="absolute top-0 w-full flex-row justify-between p-5 bg-black/30">
          <TouchableOpacity onPress={toggleFlash} className="items-center">
            {flash === 'on' ? <Zap size={20} color="yellow" /> : <ZapOff size={20} color="white" />}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFacing} className="items-center">
            <SwitchCamera size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode} className="items-center">
            {mode === 'picture' ? <Video size={20} color="white" /> : <Camera size={20} color="white" />}
          </TouchableOpacity>
        </View>

        {/* 底部工具栏 */}
        <View className="absolute bottom-0 w-full flex-row justify-around items-center p-4 bg-black/30">
          <Pressable
            onPress={mode === 'picture' ? takePicture : recordVideo}
            className={cn(
              'size-16 p-2 rounded-full border-4 border-white items-center justify-center',
              recording && 'p-5'
            )}
          >
            <View
              className={cn(
                'size-12 rounded-full',
                mode === 'picture' && 'bg-background',
                mode === 'video' && 'bg-red-400',
                recording && 'size-6 rounded-sm'
              )}
            />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}
