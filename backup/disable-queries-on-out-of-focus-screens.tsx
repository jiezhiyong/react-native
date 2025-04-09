import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Text } from '~/components/ui/text';

/**
 * 禁用非焦点屏幕上的查询
 * https://tanstack.com/query/latest/docs/framework/react/react-native#disable-queries-on-out-of-focus-screens
 */
function MyComponent() {
  const isFocused = useIsFocused();

  const { dataUpdatedAt } = useQuery({
    queryKey: ['key'],
    queryFn: () => fetch('...'),
    subscribed: isFocused,
  });

  return <Text>DataUpdatedAt: {dataUpdatedAt}</Text>;
}
