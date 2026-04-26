import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';

interface FileInfo {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  result: any;
  error: string | null;
}

export default function FileUploadDemo() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    result: null,
    error: null,
  });

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      const fileData: FileInfo = {
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: fileInfo.exists ? (fileInfo as any).size || 0 : 0,
        mimeType: asset.mimeType || 'image/jpeg',
        width: asset.width,
        height: asset.height,
      };

      setSelectedFile(fileData);

      // Reset upload state
      setUploadState({
        isUploading: false,
        progress: 0,
        result: null,
        error: null,
      });
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploadState({
      isUploading: true,
      progress: 0,
      result: null,
      error: null,
    });

    try {
      const uploadUrl = 'https://httpbin.org/post';

      const result = await FileSystem.uploadAsync(uploadUrl, selectedFile.uri, {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: 1, // FileSystem.FileSystemUploadType.MULTIPART
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        parameters: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size.toString(),
          mimeType: selectedFile.mimeType,
        },
      });

      // Parse response
      const responseData = JSON.parse(result.body);

      setUploadState({
        isUploading: false,
        progress: 100,
        result: responseData,
        error: null,
      });

      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        result: null,
        error: error instanceof Error ? error.message : 'Upload failed',
      });

      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const cancelUpload = () => {
    if (uploadState.isUploading) {
      setUploadState({
        isUploading: false,
        progress: 0,
        result: null,
        error: 'Upload cancelled',
      });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadState({
      isUploading: false,
      progress: 0,
      result: null,
      error: null,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Simulate progress for demo purposes
  useEffect(() => {
    if (uploadState.isUploading && uploadState.progress < 100) {
      const timer = setTimeout(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90), // Stop at 90% until real upload completes
        }));
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [uploadState.isUploading, uploadState.progress]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>File Upload Progress Demo</CardTitle>
              <CardDescription>Upload images with real-time progress tracking using expo-file-system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Selection */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">File Selection</Text>
                <Button onPress={pickImage} disabled={uploadState.isUploading}>
                  <Text className="text-primary-foreground">
                    {selectedFile ? 'Select Different File' : 'Select Image'}
                  </Text>
                </Button>
              </View>

              {/* File Information */}
              {selectedFile && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">File Information</Text>
                  <View className="bg-muted p-3 rounded-lg space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-medium">Name:</Text>
                      <Text className="text-sm text-muted-foreground flex-1 text-right">{selectedFile.name}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-medium">Size:</Text>
                      <Text className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-medium">Type:</Text>
                      <Text className="text-sm text-muted-foreground">{selectedFile.mimeType}</Text>
                    </View>
                    {selectedFile.width && selectedFile.height && (
                      <View className="flex-row justify-between">
                        <Text className="text-sm font-medium">Dimensions:</Text>
                        <Text className="text-sm text-muted-foreground">
                          {selectedFile.width} × {selectedFile.height}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Upload Controls */}
              {selectedFile && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Upload Controls</Text>
                  <View className="flex-row gap-2">
                    <Button onPress={uploadFile} disabled={uploadState.isUploading} className="flex-1">
                      <Text className="text-primary-foreground">
                        {uploadState.isUploading ? 'Uploading...' : 'Upload File'}
                      </Text>
                    </Button>
                    {uploadState.isUploading && (
                      <Button variant="outline" onPress={cancelUpload}>
                        <Text className="text-foreground">Cancel</Text>
                      </Button>
                    )}
                    {!uploadState.isUploading && (
                      <Button variant="outline" onPress={clearSelection}>
                        <Text className="text-foreground">Clear</Text>
                      </Button>
                    )}
                  </View>
                </View>
              )}

              {/* Upload Progress */}
              {(uploadState.isUploading || uploadState.progress > 0) && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Upload Progress</Text>
                  <View className="space-y-2">
                    <Progress value={uploadState.progress} className="h-2" />
                    <Text className="text-sm text-center text-muted-foreground">
                      {uploadState.progress.toFixed(0)}%
                    </Text>
                    {uploadState.isUploading && (
                      <Text className="text-sm text-center text-muted-foreground">Uploading to httpbin.org...</Text>
                    )}
                  </View>
                </View>
              )}

              {/* Upload Status */}
              {(uploadState.error || uploadState.result) && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Upload Status</Text>
                  {uploadState.error ? (
                    <View className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                      <Text className="text-destructive text-sm font-medium">Error</Text>
                      <Text className="text-destructive text-sm">{uploadState.error}</Text>
                    </View>
                  ) : uploadState.result ? (
                    <View className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                      <Text className="text-green-700 dark:text-green-400 text-sm font-medium">Upload Successful</Text>
                      <Text className="text-green-600 dark:text-green-500 text-xs">
                        Status: {uploadState.result.status || 'OK'}
                      </Text>
                      {uploadState.result.url && (
                        <Text className="text-green-600 dark:text-green-500 text-xs">
                          URL: {uploadState.result.url}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>
              )}

              {/* Response Details */}
              {uploadState.result && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Response Details</Text>
                  <ScrollView className="bg-muted p-3 rounded-lg max-h-32" nestedScrollEnabled>
                    <Text className="text-xs text-muted-foreground font-mono">
                      {JSON.stringify(uploadState.result, null, 2)}
                    </Text>
                  </ScrollView>
                </View>
              )}

              {/* Instructions */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Instructions</Text>
                <View className="bg-muted p-3 rounded-lg space-y-1">
                  <Text className="text-sm">1. Select an image from your library</Text>
                  <Text className="text-sm">2. Review file information</Text>
                  <Text className="text-sm">3. Start upload and watch progress</Text>
                  <Text className="text-sm">4. Files are uploaded to httpbin.org (test endpoint)</Text>
                  <Text className="text-sm text-muted-foreground">
                    Note: This demo uses a public test API for demonstration
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
