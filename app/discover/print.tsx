import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

export default function ExpoPrintScreen() {
  const [htmlContent, setHtmlContent] = useState<string>('有内鬼，终止交易');
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
    } catch (error: any) {
      Alert.alert(error?.message);
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
    } catch (error: any) {
      Alert.alert(error?.message);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">打印功能</Text>
        <Text className="text-muted-foreground">打印为PDF文件或直接打印。</Text>
      </View>

      <Text className="text-lg font-medium mb-2">内容</Text>
      <Textarea
        className="mb-6"
        multiline
        placeholder="请输入要打印的内容..."
        value={htmlContent}
        onChangeText={setHtmlContent}
      />

      <View className="flex gap-3">
        <Button onPress={printToFile} disabled={isPrinting || !htmlContent}>
          <Text>{isPrinting ? '正在生成PDF...' : '生成PDF文件'}</Text>
        </Button>

        <Button onPress={printDirectly} disabled={isPrinting || !htmlContent}>
          <Text>{isPrinting ? '正在打印...' : '直接打印'}</Text>
        </Button>
      </View>
    </View>
  );
}
