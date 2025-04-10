# typesafe-i18n 在 React Native 中的使用指南

本指南介绍如何在 React Native 项目中设置和使用 typesafe-i18n 进行国际化。

## 目录结构

```
src/i18n/
├── de/                 # 德语翻译
│   └── index.ts
├── en/                 # 英语翻译
│   └── index.ts
├── zh/                 # 中文翻译
│   └── index.ts
├── formatters/         # 格式化工具
├── loaders/            # 加载器
├── i18n-types.ts       # 类型定义
├── i18n-util.ts        # 工具函数
├── i18n-react.tsx      # React 集成
├── react-native-adapter.tsx  # React Native 适配器
└── example.tsx         # 使用示例
```

## 基本使用步骤

### 1. 安装依赖

```bash
npm install typesafe-i18n
# 或
yarn add typesafe-i18n
```

### 2. 在应用入口处添加 LocalizationProvider

在你的应用入口文件（如 App.tsx 或 \_layout.tsx）中添加 LocalizationProvider：

```tsx
import { LocalizationProvider } from './src/i18n/react-native-adapter';

export default function App() {
  return <LocalizationProvider>{/* 你的应用组件 */}</LocalizationProvider>;
}
```

### 3. 在组件中使用国际化

```tsx
import { useLocalization } from './src/i18n/react-native-adapter';

function MyComponent() {
  const { t, locale, setLocale } = useLocalization();

  return (
    <View>
      <Text>{t.welcome()}</Text>
      <Text>{t.hello({ name: '小明' })}</Text>
      <Text>{t.buttons.save()}</Text>

      {/* 切换语言 */}
      <Button
        title={locale === 'zh' ? '切换到英文' : '切换到中文'}
        onPress={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      />
    </View>
  );
}
```

## 添加新翻译

### 1. 更新类型定义

首先在 `i18n-types.ts` 中添加新的翻译键：

```typescript
type RootTranslation = {
  // 添加新的翻译键
  newKey: string;
  // 带参数的翻译
  greeting: RequiredParams<'name'>;
};

export type TranslationFunctions = {
  // 添加对应的函数类型
  newKey: () => LocalizedString;
  greeting: (arg: { name: string }) => LocalizedString;
};
```

### 2. 更新各语言文件

然后在各语言文件中添加对应的翻译：

```typescript
// zh/index.ts
const zh = {
  // 已有翻译...
  newKey: '新的翻译',
  greeting: '你好，{name:string}',
} satisfies BaseTranslation;

// en/index.ts
const en = {
  // 已有翻译...
  newKey: 'New translation',
  greeting: 'Hello, {name:string}',
} satisfies BaseTranslation;
```

## 添加新语言

### 1. 更新类型定义

在 `i18n-types.ts` 中添加新语言：

```typescript
export type Locales = 'de' | 'en' | 'zh' | 'ja'; // 添加新语言，如日语
```

### 2. 更新 i18n-util.ts

在 `i18n-util.ts` 中的 locales 数组中添加新语言：

```typescript
export const locales: Locales[] = [
  'de',
  'en',
  'zh',
  'ja', // 添加新语言
];
```

### 3. 创建新语言文件

创建新语言的翻译文件，如 `ja/index.ts`：

```typescript
import type { BaseTranslation } from '../i18n-types';

const ja = {
  // 添加日语翻译
  welcome: 'ようこそ',
  hello: 'こんにちは、{name:string}',
  // ...其他翻译
} satisfies BaseTranslation;

export default ja;
```

## 高级用法

### 1. 格式化器

可以在 `formatters` 目录下创建格式化器，用于处理日期、货币等格式化：

```typescript
// formatters/index.ts
import type { Formatters } from '../i18n-types';

export const formatters: Formatters = {
  // 添加自定义格式化器
  uppercase: (value: string) => value.toUpperCase(),
  // 日期格式化
  date: (value: Date) => value.toLocaleDateString(),
};
```

### 2. 动态加载翻译

在 `react-native-adapter.tsx` 中，我们已经实现了动态加载翻译的功能。你可以根据需要进一步扩展这个功能，例如添加持久化存储用户的语言偏好。

## 最佳实践

1. **使用嵌套结构**：将相关的翻译组织在一起，如 `buttons.save`、`buttons.cancel` 等。
2. **使用类型检查**：利用 TypeScript 的类型检查，确保所有翻译键都有对应的翻译。
3. **参数化翻译**：对于包含变量的翻译，使用参数化翻译，如 `hello: '你好，{name:string}'`。
4. **添加注释**：在类型定义中添加注释，帮助理解翻译的上下文。
5. **考虑性能**：在大型应用中，考虑按需加载翻译文件，减少初始加载时间。

## 故障排除

1. **类型错误**：确保所有语言文件都实现了 `BaseTranslation` 接口中定义的所有键。
2. **加载问题**：如果翻译无法加载，检查 `loadLocaleAsync` 函数的实现和错误处理。
3. **参数错误**：确保在使用带参数的翻译时提供了所有必需的参数。
