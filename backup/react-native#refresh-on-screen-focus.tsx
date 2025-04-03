import { useQuery } from '@tanstack/react-query';

import { useRefreshOnFocus } from '~/hooks/useRefreshOnFocus';

/**
 * 屏幕聚焦时刷新
 * https://tanstack.com/query/latest/docs/framework/react/react-native#refresh-on-screen-focus
 */
function MyComponent() {
  const { data, refetch } = useQuery({
    queryKey: ['myData'],
    queryFn: () => fetch('...'),
  });

  // 基本用法
  useRefreshOnFocus(refetch);

  // 或者传递选项
  // useRefreshOnFocus(refetch, { cancelRefetch: false });

  return null;
}
