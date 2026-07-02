import { useFocusEffect } from 'expo-router';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import React from 'react';

/**
 * 在屏幕聚焦时自动刷新查询数据
 *
 * 该钩子利用 React Navigation 的 useFocusEffect 在屏幕重新聚焦时触发数据刷新
 * 首次加载屏幕时不会触发刷新，避免重复请求
 *
 * @param refetch - 来自 useQuery 的 refetch 函数
 * @param options - 可选的 refetch 选项
 */
export function useRefreshOnFocus<T>(
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<T, Error>>,
  options?: RefetchOptions
): void {
  // 用于跟踪是否是首次加载
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      // 首次加载时跳过刷新
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // 屏幕重新聚焦时刷新数据
      refetch(options);
    }, [refetch, options])
  );
}
