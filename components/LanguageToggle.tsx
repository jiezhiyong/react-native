import React from 'react';
import { Pressable } from 'react-native';

import { Text } from '~/components/ui/text';
import { useI18nContext } from '~/i18n/i18n-react';
import { Locales } from '~/i18n/i18n-types';
import { loadLocale } from '~/i18n/i18n-util.sync';
import { cn } from '~/lib/utils';

export function LanguageToggle() {
  const { locale, setLocale } = useI18nContext();

  const applyLocale = (it: Locales) => {
    loadLocale(it);
    setLocale(it);
    return it;
  };

  React.useEffect(() => {
    setLocale(locale);
    loadLocale(locale);
  }, [locale, setLocale]);

  const toggleLocale = () => {
    const nextLocale: Locales = locale === 'en' ? 'zh' : 'en';
    applyLocale(nextLocale);
  };

  return (
    <Pressable
      onPress={toggleLocale}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => <Text className={cn(pressed && 'opacity-70')}>切换语言</Text>}
    </Pressable>
  );
}
