import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import TypesafeI18n from '~/i18n/i18n-react';
import type { Locales } from '~/i18n/i18n-types';
import { loadLocale } from '~/i18n/i18n-util.sync';

interface I18nProviderProps {
  locale: Locales;
  children: React.ReactNode;
}

/**
 * I18n提供者组件
 * 用于包装应用并提供国际化支持
 */
export function I18nProvider({ locale, children }: I18nProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // 预加载语言包
      loadLocale(locale);
      setIsLoaded(true);
    } catch (error) {
      console.error('加载语言包失败:', error);
      // 即使加载失败也设置为已加载，避免应用卡住
      setIsLoaded(true);
    }
  }, [locale]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <TypesafeI18n locale={locale}>{children}</TypesafeI18n>;
}
