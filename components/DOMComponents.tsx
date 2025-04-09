'use dom';

import { Link } from 'expo-router';
import { useEffect } from 'react';

/**
 * Demo - 在 Expo 原生应用中使用 React DOM - https://docs.expo.dev/guides/dom-components
 * 性能不如原生视图, 应主要用于渲染富文本、markdown、WebGL, 或设置页面、帮助页面等访问频率较低的部分
 */
export default function DOMComponent({
  name,
  pathname,
  onDOMLayout,
}: {
  name: string;
  pathname?: string;
  dom?: import('expo/dom').DOMProps;
  nativeActions?: (data: string) => Promise<void>;
  onDOMLayout?: (size: { width: number; height: number }) => void;
}) {
  // 检测组件是否在 DOM 组件中运行
  const IS_DOM = typeof ReactNativeWebView !== 'undefined';
  useSize(onDOMLayout);

  return (
    <div>
      <h1>Hello, {name}</h1>
      <img src={`${process.env.EXPO_BASE_URL}/assets/images/partial-react-logo.png`} />
      <Link href="/webview">webview</Link>
      <p>Pathname: {pathname}</p>
    </div>
  );
}

// Observe window size changes
function useSize(callback?: (size: { width: number; height: number }) => void) {
  useEffect(() => {
    if (!callback) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callback({ width, height });
      }
    });

    observer.observe(document.body);

    callback({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });

    return () => {
      observer.disconnect();
    };
  }, [callback]);
}
