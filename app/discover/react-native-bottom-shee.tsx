import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { sleep } from '@/lib/utils';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  // callbacks
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await sleep(1000);
    } finally {
      setRefreshing(false);
    }
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
          refreshing={refreshing}
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
    padding: 12,
  },
  itemContainer: {
    padding: 18,
    margin: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});

export default App;
