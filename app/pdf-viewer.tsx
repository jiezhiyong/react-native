import { File, Paths } from 'expo-file-system';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import PdfViewer from '@/components/PdfViewer';
import { Text } from '@/components/ui/text';

function getStringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isRemoteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function getPdfFileName(url: string) {
  const fallback = `pdf-preview-${Date.now()}.pdf`;

  try {
    const pathname = new URL(url).pathname;
    const name = pathname.split('/').filter(Boolean).pop();

    return name?.toLowerCase().endsWith('.pdf') ? name : fallback;
  } catch {
    const name = url.split('/').filter(Boolean).pop();

    return name?.toLowerCase().endsWith('.pdf') ? name : fallback;
  }
}

async function getShareUrl(url: string) {
  if (Platform.OS === 'web' || !isRemoteUrl(url)) {
    return url;
  }

  const file = new File(Paths.cache, getPdfFileName(url));
  const downloadedFile = await File.downloadFileAsync(url, file, { idempotent: true });

  return downloadedFile.uri;
}

export default function PdfViewerScreen() {
  const params = useLocalSearchParams<{ url?: string | string[] }>();
  const url = getStringParam(params.url) || 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!url || isSharing) {
      return;
    }

    try {
      setIsSharing(true);

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('提示', '当前设备不支持分享功能');
        return;
      }

      const shareUrl = await getShareUrl(url);
      await Sharing.shareAsync(shareUrl, {
        dialogTitle: '分享 PDF',
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert('分享失败', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: 'PDF 预览',
          headerRight: () => (
            <TouchableOpacity
              accessibilityLabel="分享 PDF"
              className="items-center justify-center size-10"
              disabled={!url || isSharing}
              onPress={handleShare}
              style={{ opacity: !url || isSharing ? 0.4 : 1 }}
            >
              <Share2 size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1">
        {url ? (
          <PdfViewer uri={url} />
        ) : (
          <View className="flex-1 items-center justify-center p-5">
            <Text className="text-center text-muted-foreground">缺少 PDF URL</Text>
          </View>
        )}

        {isSharing ? (
          <View className="absolute inset-0 items-center justify-center bg-background/70">
            <ActivityIndicator size="large" />
          </View>
        ) : null}
      </View>
    </View>
  );
}
