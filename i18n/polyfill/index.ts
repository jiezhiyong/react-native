// 在 React Native 环境中，我们需要为 Intl 命名空间提供 polyfill
import getCanonicalLocales from '@formatjs/intl-getcanonicallocales/polyfill';
import Locale from '@formatjs/intl-locale/polyfill';
import PluralRules from '@formatjs/intl-pluralrules/polyfill';

export { getCanonicalLocales, Locale, PluralRules };
