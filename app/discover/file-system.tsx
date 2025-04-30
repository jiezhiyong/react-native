import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function FileSystemScreen() {
  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">文件系统</Text>
        <Text className="text-muted-foreground">在应用中进行文件和目录的创建、读取和管理。</Text>
      </View>

      <View className="items-center justify-center flex-1">
        <Text className="text-muted-foreground">功能开发中...</Text>
      </View>
    </View>
  );
}

// import { Directory, File, Paths } from 'expo-file-system/next';
// import React, { useCallback, useState } from 'react';
// import { ScrollView, View } from 'react-native';

// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { Text } from '../../components/ui/text';

// // 文件系统操作示例组件
// export default function ExpoFileSystemScreen() {
//   const [logMessages, setLogMessages] = useState<string[]>([]);

//   // 添加日志信息
//   const addLog = useCallback((message: string) => {
//     setLogMessages((prev) => [...prev, message]);
//   }, []);

//   // 创建、写入和读取文件示例
//   const createReadWriteFile = async () => {
//     try {
//       const file = new File(Paths.cache, 'example.txt');
//       file.create(); // can throw an error if the file already exists or no permission to create it
//       file.write('有内鬼，终止交易');
//       addLog(`文件创建、写入和读取成功: ${file.size} 字节`);
//     } catch (error) {
//       addLog(`${error instanceof Error ? error.message : String(error)}`);
//     }
//   };

//   // 下载文件示例
//   const downloadFile = async () => {
//     const url = 'https://pdfobject.com/pdf/sample.pdf';
//     const destination = new Directory(Paths.cache, 'pdfs');

//     try {
//       destination.create();
//       const output = await File.downloadFileAsync(url, destination);
//       addLog(`文件下载成功: ${output.uri}`); // path to the downloaded file, e.g. '${cacheDirectory}/pdfs/sample.pdf'
//     } catch (error) {
//       addLog(`${error instanceof Error ? error.message : String(error)}`);
//     }
//   };

//   return (
//     <>
//       {/* 操作按钮 */}
//       <View className="flex-row flex-wrap gap-3 mb-4">
//         <Button onPress={createReadWriteFile}>
//           <Text>创建、写入和读取文件</Text>
//         </Button>
//         <Button onPress={downloadFile}>
//           <Text>下载文件</Text>
//         </Button>
//       </View>

//       {/* 操作日志 */}
//       <Card className="p-4">
//         <Text className="font-bold mb-2">操作日志:</Text>
//         <View className="bg-muted p-2 rounded max-h-60">
//           <ScrollView>
//             {logMessages.length > 0 ? (
//               logMessages.map((log, index) => (
//                 <Text key={index} className="font-mono text-xs mb-4">
//                   {index + 1}. {log}
//                 </Text>
//               ))
//             ) : (
//               <Text className="text-muted-foreground">尚无日志</Text>
//             )}
//           </ScrollView>
//         </View>
//       </Card>
//     </>
//   );
// }
