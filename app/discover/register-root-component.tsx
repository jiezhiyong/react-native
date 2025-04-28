// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
// import { Platform, ScrollView, Text, View } from 'react-native';

// // 保持启动画面可见
// SplashScreen.preventAutoHideAsync();

// export default function ExpoRegisterRootComponentScreen() {
//   const [isReady, setIsReady] = useState(false);
//   const [error, setError] = useState('');
//   const [fontLoaded, setFontLoaded] = useState(false);
//   const [appState, setAppState] = useState({
//     platform: Platform.OS,
//     version: Platform.Version,
//     isTV: Platform.isTV,
//     isTesting: __DEV__,
//   });

//   // 加载字体
//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           Roboto: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Roboto.ttf'),
//           Roboto_medium: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Roboto_medium.ttf'),
//         });
//         setFontLoaded(true);
//       } catch (error) {
//         setError('字体加载失败: ' + (error as Error).message);
//       }
//     }
//     loadFonts();
//   }, []);

//   // 初始化应用
//   useEffect(() => {
//     async function prepare() {
//       try {
//         // 这里可以添加其他初始化逻辑
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟初始化过程
//         setIsReady(true);
//       } catch (error) {
//         setError('应用初始化失败: ' + (error as Error).message);
//       } finally {
//         // 隐藏启动画面
//         await SplashScreen.hideAsync();
//       }
//     }
//     prepare();
//   }, []);

//   if (!isReady || !fontLoaded) {
//     return null;
//   }

//   return (
//     <ScrollView className="flex-1 p-6">
//       <StatusBar style="auto" />

//       <View className="mb-6">
//         <Text className="text-lg font-bold mb-2">根组件注册</Text>
//         <Text className="text-gray-600 mb-4">此功能展示了如何注册根组件并配置应用的基本设置。</Text>
//       </View>

//       {/* 应用状态信息 */}
//       <View className="mb-8">
//         <Text className="text-base font-semibold mb-4">应用状态</Text>
//         <View className="bg-gray-100 rounded-lg p-4">
//           <Text className="text-gray-600 mb-2">平台: {appState.platform}</Text>
//           <Text className="text-gray-600 mb-2">版本: {appState.version}</Text>
//           <Text className="text-gray-600 mb-2">TV模式: {appState.isTV ? '是' : '否'}</Text>
//           <Text className="text-gray-600">开发模式: {appState.isTesting ? '是' : '否'}</Text>
//         </View>
//       </View>

//       {/* 错误提示 */}
//       {error ? (
//         <View className="bg-red-100 rounded-lg p-4 mb-8">
//           <Text className="text-red-500">{error}</Text>
//         </View>
//       ) : null}

//       {/* 说明区域 */}
//       <View className="bg-gray-100 rounded-lg p-4">
//         <Text className="text-base font-semibold mb-2">使用说明</Text>
//         <Text className="text-gray-600">
//           1. 根组件注册：配置应用的基本设置
//           {'\n'}2. 启动画面：控制应用的启动过程
//           {'\n'}3. 字体加载：预加载应用所需的字体
//           {'\n'}4. 状态栏：配置应用的状态栏样式
//         </Text>
//       </View>

//       <View className="mt-6">
//         <Text className="text-sm text-gray-500">
//           注意：
//           {'\n'}1. 需要安装 expo-splash-screen 和 expo-font
//           {'\n'}2. 启动画面配置需要在 app.json 中设置
//           {'\n'}3. 字体文件需要正确放置在项目中
//           {'\n'}4. 建议在真机上测试启动过程
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }
