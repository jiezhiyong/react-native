import React from 'react';
import { Pressable, View } from 'react-native';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';
import type { Locales } from '@/i18n/i18n-types';
import { loadLocale } from '@/i18n/i18n-util.sync';
import { Languages } from '@/icons/Languages';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/store/locale';

export function LanguageToggle() {
  const { LL, setLocale } = useI18nContext();
  const locale = useLocaleStore((state) => state.locale);
  const toggleLocale = useLocaleStore((state) => state.toggleLocale);

  React.useEffect(() => {
    loadLocale(locale);
    setLocale(locale);
  }, [locale, setLocale]);

  return (
    <Pressable
      onPress={toggleLocale}
      accessibilityRole="button"
      accessibilityLabel={LL.common.languageToggle()}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View className={cn('flex-1 aspect-square justify-center items-start web:px-2', pressed && 'opacity-70')}>
          <Languages className="text-foreground" size={20} strokeWidth={1.5} />
        </View>
      )}
    </Pressable>
  );
}

const LANGUAGE_OPTIONS: { label: string; value: Locales }[] = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
];

interface LanguageMenuToggleProps {
  iconColor?: string;
}

export function LanguageMenuToggle({ iconColor = '#141413' }: LanguageMenuToggleProps) {
  const { LL, setLocale } = useI18nContext();
  const locale = useLocaleStore((state) => state.locale);
  const setSelectedLocale = useLocaleStore((state) => state.setLocale);

  React.useEffect(() => {
    loadLocale(locale);
    setLocale(locale);
  }, [locale, setLocale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={LL.common.languageToggle()}
          className="size-10 items-center justify-center web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
        >
          {({ pressed }) => (
            <View className={cn('size-10 items-center justify-center', pressed && 'opacity-70')}>
              <Languages color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={12}>
        <DropdownMenuRadioGroup
          style={{ maxHeight: 300 }}
          className="overflow-y-auto"
          value={locale}
          onValueChange={(value) => setSelectedLocale(value as Locales)}
        >
          {LANGUAGE_OPTIONS.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value} textValue={language.label}>
              <Text>{language.label}</Text>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
