// TODO: 引发WEB端崩溃
// import { useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { usePagerView } from 'react-native-pager-view';

// import { Button } from '~/components/ui/button';
// import { Text } from '~/components/ui/text';

// const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

// export default function ExpoViewPagerScreen() {
//   const { AnimatedPagerView, ref } = usePagerView({ pagesAmount: colors.length });

//   const [currentPage, setCurrentPage] = useState(0);

//   return (
//     <View className="flex-1 px-6 pt-6">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold mb-2">视图分页器</Text>
//         <Text className="text-muted-foreground">使用视图分页器组件</Text>
//       </View>

//       <View className="flex-1">
//         {/* 分页器 */}
//         <AnimatedPagerView
//           ref={ref}
//           style={styles.pagerView}
//           initialPage={0}
//           onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
//           pageMargin={10}
//           overdrag
//         >
//           {colors.map((color, index) => (
//             <View key={index} style={[styles.page, { backgroundColor: color }]}>
//               <Text className="text-2xl font-bold">{index}</Text>
//             </View>
//           ))}
//         </AnimatedPagerView>

//         {/* 页面指示器 */}
//         <View className="flex-row justify-center items-center p-4">
//           {colors.map((_, index) => (
//             <View
//               key={index}
//               className={`w-2 h-2 rounded-full mx-1 ${index === currentPage ? 'bg-primary' : 'bg-muted'}`}
//             />
//           ))}
//         </View>
//       </View>

//       {/* 控制按钮 */}
//       <View className="flex-row gap-3">
//         <Button
//           className="flex-1"
//           disabled={currentPage === 0}
//           onPress={() => {
//             if (currentPage > 0) {
//               ref.current?.setPage(currentPage - 1);
//             }
//           }}
//         >
//           <Text>上一页</Text>
//         </Button>

//         <Button
//           className="flex-1"
//           disabled={currentPage === colors.length - 1}
//           onPress={() => {
//             if (currentPage < colors.length - 1) {
//               ref.current?.setPage(currentPage + 1);
//             }
//           }}
//         >
//           <Text>下一页</Text>
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   pagerView: {
//     flex: 1,
//   },
//   page: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
// });
