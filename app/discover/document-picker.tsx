import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

export default function ExpoDocumentPickerScreen() {
  // 状态管理：单文件选择结果
  const [singleDocument, setSingleDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  // 状态管理：多文件选择结果
  const [multipleDocuments, setMultipleDocuments] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  // 选择单个文件
  const pickSingleDocument = async () => {
    try {
      // 调用文档选择器，允许选择任何类型的文件
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // 允许任何类型的文件
        copyToCacheDirectory: true, // 将文件复制到缓存目录，便于后续访问
      });

      // 判断用户是否成功选择了文件
      if (!result.canceled) {
        setSingleDocument(result);
      } else {
      }
    } catch (error) {
      console.error('选择文件时出错:', error);
    }
  };

  // 选择多个文件
  const pickMultipleDocuments = async () => {
    try {
      // 调用文档选择器，允许选择多个文件
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // 允许任何类型的文件
        multiple: true, // 允许多选
        copyToCacheDirectory: true, // 将文件复制到缓存目录，便于后续访问
      });

      // 判断用户是否成功选择了文件
      if (!result.canceled) {
        setMultipleDocuments(result);
      }
    } catch (error) {
      console.error('选择多个文件时出错:', error);
    }
  };

  // 选择图片文件
  const pickImageDocument = async () => {
    try {
      // 调用文档选择器，仅允许选择图片文件
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // 仅允许图片类型
        copyToCacheDirectory: true,
      });

      // 判断用户是否成功选择了文件
      if (!result.canceled) {
        setSingleDocument(result);
      }
    } catch (error) {
      console.error('选择图片时出错:', error);
    }
  };

  // 选择PDF文件
  const pickPDFDocument = async () => {
    try {
      // 调用文档选择器，仅允许选择PDF文件
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // 仅允许PDF类型
        copyToCacheDirectory: true,
      });

      // 判断用户是否成功选择了文件
      if (!result.canceled) {
        setSingleDocument(result);
      }
    } catch (error) {
      console.error('选择PDF时出错:', error);
    }
  };

  // 格式化文件大小，转换为更直观的显示
  const formatFileSize = (bytes: number | undefined): string => {
    if (bytes === undefined) return '未知大小';

    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">文档选择器</Text>
        <Text className="text-muted-foreground">从设备存储中选择和导入文档文件</Text>
      </View>

      {/* 按钮区域 */}
      <View className="flex gap-3">
        <Button onPress={pickSingleDocument}>
          <Text>选择单个文件</Text>
        </Button>
        <Button onPress={pickMultipleDocuments}>
          <Text>选择多个文件</Text>
        </Button>

        <Button onPress={pickImageDocument}>
          <Text>选择图片</Text>
        </Button>
        <Button onPress={pickPDFDocument}>
          <Text>选择PDF</Text>
        </Button>
      </View>

      {/* 单文件选择结果 */}
      {singleDocument && !singleDocument.canceled && singleDocument.assets && singleDocument.assets.length > 0 && (
        <Card className="p-4 mt-6 flex-col gap-3">
          <Text className="font-medium">单文件选择结果</Text>
          <View className="bg-card-foreground/5 p-4 rounded-md">
            <Text className="text-sm">文件名: {singleDocument.assets[0].name}</Text>
            <Text className="text-sm">文件大小: {formatFileSize(singleDocument.assets[0].size)}</Text>
            <Text className="text-sm">MIME类型: {singleDocument.assets[0].mimeType || '未知'}</Text>
          </View>
        </Card>
      )}

      {/* 多文件选择结果 */}
      {multipleDocuments &&
        !multipleDocuments.canceled &&
        multipleDocuments.assets &&
        multipleDocuments.assets.length > 0 && (
          <Card className="p-4 mt-6 flex-col gap-3">
            <Text className="font-medium">多文件选择结果 ({multipleDocuments.assets.length} 个文件)</Text>
            {multipleDocuments.assets.map((doc, index) => (
              <View key={index} className="bg-card-foreground/5 p-4 rounded-md flex-col gap-1">
                <Text className="text-sm">文件名: {doc.name}</Text>
                <Text className="text-sm">文件大小: {formatFileSize(doc.size)}</Text>
                <Text className="text-sm">MIME类型: {doc.mimeType || '未知'}</Text>
              </View>
            ))}
          </Card>
        )}
    </ScrollView>
  );
}
