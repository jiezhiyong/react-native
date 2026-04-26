import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  // callbacks
  const handleRefresh = useCallback(() => {
    console.log('handleRefresh');
  }, []);

  // render
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  return (
    <View style={styles.container}>
      <BottomSheet snapPoints={snapPoints}>
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshing={false}
          onRefresh={handleRefresh}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 12,
    margin: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});

export default App;
