import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoPrintScreen() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const printToFile = async () => {
    try {
      setIsPrinting(true);
      const { uri } = await Print.printToFileAsync({
        html: `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              <style>
                body { font-family: Arial; padding: 20px; }
                h1 { color: #333; }
                p { line-height: 1.5; }
              </style>
            </head>
            <body>
              <h1>打印测试</h1>
              <p>${htmlContent}</p>
              <p>打印时间: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `,
      });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('打印失败:', error);
      Alert.alert('错误', '打印失败');
    } finally {
      setIsPrinting(false);
    }
  };

  const printDirectly = async () => {
    try {
      setIsPrinting(true);
      await Print.printAsync({
        html: `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              <style>
                body { font-family: Arial; padding: 20px; }
                h1 { color: #333; }
                p { line-height: 1.5; }
              </style>
            </head>
            <body>
              <h1>直接打印测试</h1>
              <p>${htmlContent}</p>
              <p>打印时间: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `,
      });
    } catch (error) {
      console.error('打印失败:', error);
      Alert.alert('错误', '打印失败');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">打印功能</Text>
        <Text className="text-gray-600 mb-4">
          此功能用于打印内容，支持打印为PDF文件或直接打印。
        </Text>
      </View>

      <View className="space-y-4">
        <View className="p-4 bg-gray-100 rounded-lg">
          <Text className="text-base mb-2">打印内容</Text>
          <TextInput
            className="bg-white p-4 rounded-lg h-32"
            multiline
            placeholder="请输入要打印的内容..."
            value={htmlContent}
            onChangeText={setHtmlContent}
          />
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={printToFile}
            disabled={isPrinting || !htmlContent}
          >
            <Ionicons name="document" size={20} color="white" />
            <Text className="text-white ml-2 text-lg">
              {isPrinting ? '正在生成PDF...' : '生成PDF文件'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={printDirectly}
            disabled={isPrinting || !htmlContent}
          >
            <Ionicons name="print" size={20} color="white" />
            <Text className="text-white ml-2 text-lg">
              {isPrinting ? '正在打印...' : '直接打印'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要设备支持打印功能
          {'\n'}2. 某些设备可能不支持直接打印
          {'\n'}3. PDF文件生成后会自动打开分享界面
        </Text>
      </View>
    </ScrollView>
  );
}
